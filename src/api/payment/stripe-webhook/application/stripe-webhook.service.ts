import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { SubscriptionService } from '../../subscription/application/subscription.service';
import { CreateStripeEventCommand } from './cqrs/command/create-stripe-event.command';
import Stripe from 'stripe';
import { UpdateUserRoleCommand } from '../../../user/application/cqrs/command/update-user-role.command';
import { StripeService } from '../../stripe/application/stripe.service';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { ProductService } from '../../product/application/product.service';
import { ProductResponse } from '../../product/web/response/product.response';
import { GetUserByStripeCustomerIdQuery } from './cqrs/query/get-user-by-stripe-customer-id.query';
import { ProfileService } from '../../../profile/application/profile.service';
import { RoleProfileEnum } from '../../../profile/domain/enum/role-profile.enum';

@Injectable()
export class StripeWebhookService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly subscriptionService: SubscriptionService,
    private readonly stripeService: StripeService,
    private readonly productService: ProductService,
    private readonly profileService: ProfileService,
  ) {}

  async processSubscriptionUpdate(event: Stripe.Event, subscription: Stripe.Subscription): Promise<void> {
    await this.commandBus
      .execute(
        new CreateStripeEventCommand({
          stripEventId: event.id,
        }),
      )
      .catch(async (error: Error) => {
        if (error.message === 'StripEvent already exist') {
          return;
        }
      });

    const data: Stripe.Subscription = event.data.object as Stripe.Subscription;

    const customerId: string = data.customer as string;
    const subscriptionStatus: Stripe.Subscription.Status = data.status;

    await this.subscriptionService.updateMonthlySubscriptionStatus(customerId, subscriptionStatus);
  }

  async processPayment(event: Stripe.Event, jsonObject: object): Promise<void> {
    try {
      // Identifier l'événement spécifique de paiement réussi
      if (event.type === 'payment_intent.succeeded' || event.type === 'charge.succeeded') {
        const paymentSucceededEvent = event.data.object as Stripe.PaymentIntent | Stripe.Charge;

        // Extraire les métadonnées du paiement pour obtenir les informations nécessaires
        const productId = paymentSucceededEvent.metadata.productId;
        const userId = paymentSucceededEvent.metadata.userId;

        // Vérifier le produit payé et mettre à jour le rôle de l'utilisateur en conséquence
        if (productId === 'your_product_id') {
          // Vérifier si l'utilisateur a déjà un profil
          const isUserOwnerOfCustomerID = await this.stripeService.isUserIdOwnerOfStripeCustomerId(
            userId,
            paymentSucceededEvent.customer as string,
          );

          if (!isUserOwnerOfCustomerID) {
            throw new Error('User does not have a profile');
          }
        }

        const userEntity: UserEntity = await this.commandBus.execute(
          new GetUserByStripeCustomerIdQuery({
            stripeCustomerId: paymentSucceededEvent.customer as string,
          }),
        );
        const productEntity: ProductResponse = await this.productService.getProductById(productId);
        await this.commandBus.execute(
          new UpdateUserRoleCommand({
            userId: userId,
            roles: userEntity.roles.concat(productEntity.userRoleToGive),
          }),
        );
        await this.profileService.createProfile(userId, {
          userId: userId,
          roleProfile: productEntity.profileRoleToGive,
          usernameProfile: userEntity.username ?? 'username',
          occupationsId: [],
        });
      }
      throw new Error('Event type not supported');
    } catch (error) {
      throw new InternalServerErrorException('Failed to process payment event');
    }
  }
}

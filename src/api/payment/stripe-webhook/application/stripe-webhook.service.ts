import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { SubscriptionService } from '../../subscription/application/subscription.service';
import Stripe from 'stripe';
import { StripeService } from '../../stripe/application/stripe.service';
import { ProductService } from '../../product/application/product.service';
import { ProfileService } from '../../../profile/application/profile.service';
import { StripeEventTypeEnum } from '../domain/enum/stripe-event-type.enum';
import { GetUserByStripeCustomerIdQuery } from './cqrs/query/get-user-by-stripe-customer-id.query';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { PriceEntity } from '../../price/domain/entities/price.entity';
import { PriceService } from '../../price/application/price.service';
import { ProductEntity } from '../../product/domain/entities/product.entity';
import { InvoiceService } from '../../invoices/application/invoice.service';
import { SubscriptionEntity } from '../../subscription/domain/entities/subscription.entity';
import { UserService } from '../../../user/application/user.service';
import { ProfileResponse } from '../../../profile/web/response/profile.response';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import { RoleProfileEnum } from '../../../profile/domain/enum/role-profile.enum';
import { UserRoleEnum } from '../../../user/domain/enum/user-role.enum';

@Injectable()
export class StripeWebhookService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    private readonly subscriptionService: SubscriptionService,
    private readonly stripeService: StripeService,
    private readonly productService: ProductService,
    private readonly profileService: ProfileService,
    private readonly priceService: PriceService,
    private readonly invoiceService: InvoiceService,
    private readonly userService: UserService,
  ) {}

  async processSubscription(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case StripeEventTypeEnum.SUBSCRIPTION_CREATED:
        await this.processSubscriptionCreated(event);
        break;
      case StripeEventTypeEnum.SUBSCRIPTION_UPDATED:
        await this.processSubscriptionUpdated(event);
        break;
      case StripeEventTypeEnum.SUBSCRIPTION_DELETED:
        await this.processSubscriptionDeleted(event);
        break;
      default:
        throw new BadRequestException('Invalid Stripe event type');
    }
  }

  private async getUserByStripeCustomerId(stripeCustomerId: string): Promise<UserEntity> {
    return await this.queryBus
      .execute(
        new GetUserByStripeCustomerIdQuery({
          stripeCustomerId: stripeCustomerId,
        }),
      )
      .catch(error => {
        if (error.message === 'User not found') throw new BadRequestException('User not found');
        throw new InternalServerErrorException(error.message);
      });
  }

  private async getPriceByStripePriceId(stripePriceId: string): Promise<PriceEntity> {
    return await this.priceService.getPriceByStripePriceId(stripePriceId);
  }

  private async processSubscriptionCreated(event: Stripe.Event): Promise<void> {
    // parse Stripe.event
    const stripeSubscription: Stripe.Subscription = event.data.object as Stripe.Subscription;
    const stripeCustomerId: string = stripeSubscription.customer as string;
    const priceStripeId: string = stripeSubscription.items.data[0].price.id;
    const latestInvoiceId: string = stripeSubscription.latest_invoice as string;

    // get full object
    const userEntity: UserEntity = await this.getUserByStripeCustomerId(stripeCustomerId);
    const priceEntity: PriceEntity = await this.getPriceByStripePriceId(priceStripeId);
    const productEntity: ProductEntity = priceEntity.product;

    const subscriptionEntity: SubscriptionEntity = await this.subscriptionService.createSubscriptionFromWebhook(
      userEntity,
      priceEntity,
      stripeSubscription,
      latestInvoiceId,
    );

    await this.invoiceService.createInvoiceFromStripeInvoiceId(latestInvoiceId, subscriptionEntity, userEntity);

    userEntity.roles.push(productEntity.userRoleToGive);
    await this.userService.updateRoles(userEntity.id, userEntity.roles);

    if (priceEntity.product.profileRoleToGive === RoleProfileEnum.COMPANY) {
      const matchingProfile: ProfileEntity | undefined = userEntity.profiles.find(
        (profileEntity: ProfileEntity) => profileEntity.roleProfile === productEntity.profileRoleToGive,
      );
      if (matchingProfile) {
        await this.profileService.restoreProfile(matchingProfile.id);
        await this.subscriptionService.assignProfileToSubscription(subscriptionEntity.id, matchingProfile.id, true);
      } else {
        const profileResponse: ProfileResponse = await this.profileService.createProfile(userEntity.id, {
          userId: userEntity.id,
          usernameProfile: userEntity.username ?? 'undefined',
          roleProfile: productEntity.profileRoleToGive,
          occupationsId: [],
        });
        await this.subscriptionService.assignProfileToSubscription(subscriptionEntity.id, profileResponse.id, true);
      }
    } else if (priceEntity.product.profileRoleToGive === RoleProfileEnum.PREMIUM) {
      const matchingProfile: ProfileEntity | undefined = userEntity.profiles.find(
        (profileEntity: ProfileEntity) => profileEntity.roleProfile === productEntity.profileRoleToGive,
      );
      if (matchingProfile) {
        matchingProfile.roleProfile = RoleProfileEnum.PREMIUM;
        await this.subscriptionService.assignProfileToSubscription(subscriptionEntity.id, matchingProfile.id, true);
        await this.profileService.updateRoleProfile(matchingProfile.id, RoleProfileEnum.PREMIUM);
      }
    }
  }

  private async processSubscriptionUpdated(event: Stripe.Event): Promise<void> {
    // parse Stripe.event
    const stripeSubscription: Stripe.Subscription = event.data.object as Stripe.Subscription;
    const stripeCustomerId: string = stripeSubscription.customer as string;
    const priceStripeId: string = stripeSubscription.items.data[0].price.id;
    const latestInvoiceId: string = stripeSubscription.latest_invoice as string;

    // get full object
    const userEntity: UserEntity = await this.getUserByStripeCustomerId(stripeCustomerId);
    const priceEntity: PriceEntity = await this.getPriceByStripePriceId(priceStripeId);

    const subscriptionEntity: SubscriptionEntity = await this.subscriptionService.updateSubscriptionFromWebhook(
      priceEntity,
      stripeSubscription,
      latestInvoiceId,
    );
    if (subscriptionEntity.stripeLatestInvoiceId !== latestInvoiceId) {
      await this.invoiceService.createInvoiceFromStripeInvoiceId(latestInvoiceId, subscriptionEntity, userEntity);
    }
  }

  private async processSubscriptionDeleted(event: Stripe.Event): Promise<void> {
    // parse Stripe.event
    const stripeSubscription: Stripe.Subscription = event.data.object as Stripe.Subscription;
    const stripeCustomerId: string = stripeSubscription.customer as string;
    const priceStripeId: string = stripeSubscription.items.data[0].price.id;

    // get full object
    const userEntity: UserEntity = await this.getUserByStripeCustomerId(stripeCustomerId);
    const priceEntity: PriceEntity = await this.getPriceByStripePriceId(priceStripeId);
    const productEntity: ProductEntity = priceEntity.product;

    const subscriptionEntity: SubscriptionEntity = await this.subscriptionService.getSubscriptionByStripeSubscriptionId(
      stripeSubscription.id,
    );

    // update owner subscription Roles
    userEntity.roles = userEntity.roles.filter((role: UserRoleEnum) => role !== productEntity.userRoleToGive);
    await this.userService.updateRoles(userEntity.id, userEntity.roles);

    if (subscriptionEntity.price.product.userRoleToGive === UserRoleEnum.COMPANY_ACCOUNT) {
      // soft remove owner subscription Profile
      if (!subscriptionEntity.profileOwnerId) throw new BadRequestException('Subscription has no profile owner');
      await this.profileService.softRemoveProfile(subscriptionEntity.profileOwnerId);
    } else if (subscriptionEntity.price.product.userRoleToGive === UserRoleEnum.PREMIUM_ACCOUNT) {
      // update owner subscription Profile
      if (!subscriptionEntity.profileOwnerId) throw new BadRequestException('Subscription has no profile owner');

      await this.profileService.updateRoleProfile(subscriptionEntity.profileOwnerId, RoleProfileEnum.CLASSIC);
    }

    await this.subscriptionService.cancelSubscription(subscriptionEntity.id);
  }
}

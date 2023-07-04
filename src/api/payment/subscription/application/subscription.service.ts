import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { StripeService } from '../../stripe/application/stripe.service';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { ErrorCustomEvent } from '../../../../util/exception/error-handler/error-custom.event';
import { PriceService } from '../../price/application/price.service';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { CreateSubscriptionCommand } from './cqrs/command/create-subscription.command';
import { CancelSubscriptionCommand } from './cqrs/command/cancel-subscription.command';
import { UpdateAccountStatusCommand } from './cqrs/command/update-account-status.command';
import { UserAccountStatusEnum } from '../../../user/domain/enum/user-account-status.enum';
import { GetAllActiveSubscriptionQuery } from './cqrs/query/get-all-active-subscription.query';
import { SubscriptionEntity } from '../domain/entities/subscription.entity';
import { PriceEntity } from '../../price/domain/entities/price.entity';
import { AssignProfileToSubscriptionCommand } from './cqrs/command/assign-profile-to-subscription.command';
import { UpdateSubscriptionCommand } from './cqrs/command/update-subscription.command';
import { GetSubscriptionByStripeSubscriptionIdQuery } from './cqrs/query/get-subscription-by-stripe-subscription-id.query';
import { GetAllSubscriptionQuery } from './cqrs/query/get-all-subscription.query';
import { CreateSubscriptionRequest } from '../web/request/create-subscription.request';
import { RemoveSubscriptionCommand } from './cqrs/command/remove-subscription.command';
import { GetListMySubscriptionQuery } from './cqrs/query/get-list-my-subscription.query';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    private readonly stripeService: StripeService,
    private readonly priceService: PriceService,
  ) {}

  async getListSubscription(
    stripCustomerId: string,
    stripePriceId: string,
  ): Promise<Stripe.ApiList<Stripe.Subscription>> {
    const subscription: Stripe.ApiList<Stripe.Subscription> = await this.stripeService.getListSubscription(
      stripCustomerId,
      stripePriceId,
    );

    if (subscription.data.length === 0) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'SubscriptionService',
          error: 'User have no subscription',
          localisation: 'stripe.subscriptions.list',
        }),
      );
      throw new BadRequestException('User have no subscription');
    }

    return subscription;
  }

  async cancelSubscription(subscriptionId: string, stipeUserId: string): Promise<void> {
    const stripSubscription: Stripe.Subscription = await this.stripeService.getSubscription(subscriptionId);

    await this.stripeService.cancelSubscription(stipeUserId, stripSubscription.id);
  }

  async handlerUserCancelSubscription(userId: string, stipeUserId: string, subscriptionId: string): Promise<void> {
    console.log('handlerUserCancelSubscription', userId, stipeUserId, subscriptionId);
    const stripSubscription: Stripe.Subscription = await this.stripeService.getSubscription(subscriptionId);

    await this.stripeService.cancelSubscription(stipeUserId, stripSubscription.id);
  }

  async updateUserSubscriptionEnum(userId: string, subscriptionStatus: UserAccountStatusEnum): Promise<void> {
    return await this.commandBus
      .execute(
        new UpdateAccountStatusCommand({
          status: subscriptionStatus,
          userId: userId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Error while updating subscription')
          throw new InternalServerErrorException(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  async getAllActiveSubscriptionsCount(): Promise<number> {
    return await this.queryBus.execute(new GetAllActiveSubscriptionQuery());
  }

  async createSubscriptionFromWebhook(
    userEntity: UserEntity,
    priceEntity: PriceEntity,
    stripeSubscription: Stripe.Subscription,
    latestInvoiceId: string,
  ): Promise<SubscriptionEntity> {
    return await this.commandBus
      .execute(
        new CreateSubscriptionCommand({
          latestInvoiceId: latestInvoiceId,
          priceEntity: priceEntity,
          userEntity: userEntity,
          stripeSubscription: stripeSubscription,
        }),
      )
      .catch(async error => {
        if (error.message === 'Error while saving subscription') throw new InternalServerErrorException(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  async assignProfileToSubscription(
    subscriptionId: string,
    profileId: string,
    isSubscriptionOwner: boolean,
  ): Promise<void> {
    return await this.commandBus
      .execute(
        new AssignProfileToSubscriptionCommand({
          subscriptionId: subscriptionId,
          profileId: profileId,
          isSubscriptionOwner: isSubscriptionOwner,
        }),
      )
      .catch(async error => {
        if (error.message === 'Subscription not found') throw new BadRequestException(error.message);
        if (error.message === 'Profile not found') throw new BadRequestException(error.message);
        if (error.message === 'Error while assigning subscription')
          throw new InternalServerErrorException(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  async updateSubscriptionFromWebhook(
    priceEntity: PriceEntity,
    stripeSubscription: Stripe.Subscription,
    latestInvoiceId: string,
  ): Promise<SubscriptionEntity> {
    return await this.commandBus
      .execute(
        new UpdateSubscriptionCommand({
          latestInvoiceId: latestInvoiceId,
          priceEntity: priceEntity,
          stripeSubscription: stripeSubscription,
        }),
      )
      .catch(async error => {
        if (error.message === 'Error while updating subscription')
          throw new InternalServerErrorException(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  async getSubscriptionByStripeSubscriptionId(stripeSubscriptionId: string): Promise<SubscriptionEntity> {
    return await this.queryBus
      .execute(
        new GetSubscriptionByStripeSubscriptionIdQuery({
          stripeSubscriptionId: stripeSubscriptionId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Subscription not found') throw new BadRequestException(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  async getAllSubscriptions(): Promise<SubscriptionEntity[]> {
    return await this.queryBus.execute(new GetAllSubscriptionQuery());
  }

  async createSubscription(
    createSubscriptionRequest: CreateSubscriptionRequest,
  ): Promise<Stripe.Response<Stripe.Subscription>> {
    return await this.stripeService.createSubscription(createSubscriptionRequest);
  }

  async removeSubscription(subscriptionId: string): Promise<void> {
    await this.commandBus
      .execute(
        new RemoveSubscriptionCommand({
          subscriptionId: subscriptionId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Subscription not removed') throw new InternalServerErrorException(error.message);
        if (error.message === 'Subscription not found') throw new BadRequestException(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }

  private async isUserAlreadySubscribed(stripeCustomerId: string, priceId: string): Promise<boolean> {
    const subscription: Stripe.ApiList<Stripe.Subscription> = await this.stripeService.getListSubscription(
      stripeCustomerId,
      priceId,
    );

    if (subscription.data.length > 0) {
      const latestSubscription: Stripe.Subscription | undefined = subscription.data.find(subscription => {
        if (subscription.latest_invoice === subscription.id) {
          return subscription;
        }
      });
      if (latestSubscription?.status === 'active' || latestSubscription?.status === 'trialing') {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'SubscriptionService',
            error: 'User already have a subscription',
            localisation: 'stripe.subscriptions.list',
          }),
        );
        throw new BadRequestException('User already have an active subscription');
      }
    }
    return false;
  }

  async getListMySubscription(userId: string): Promise<SubscriptionEntity[]> {
    return await this.queryBus
      .execute(
        new GetListMySubscriptionQuery({
          userId: userId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Subscription not found') throw new BadRequestException(error.message);
        if (error.message === 'User not found') throw new BadRequestException(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }
}

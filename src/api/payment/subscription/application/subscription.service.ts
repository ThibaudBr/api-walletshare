import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { StripeService } from '../../stripe/application/stripe.service';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { ErrorCustomEvent } from '../../../../util/exception/error-handler/error-custom.event';
import { UpdateMonthlySubscriptionStatusCommand } from './cqrs/command/update-monthly-subscription-status.command';
import { ConfigService } from '@nestjs/config';
import { CreateSubscriptionRequest } from '../web/request/create-subscription.request';
import { PriceService } from '../../price/application/price.service';
import { PriceResponse } from '../../price/web/response/price.response';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { GetUserWithReferralCodeByUserIdQuery } from './cqrs/query/get-user-with-referral-code-by-user-id.query';
import { CreateSubscriptionCommand } from './cqrs/command/create-subscription.command';
import { CreateUsedReferralCodeCommand } from './cqrs/command/create-used-referral-code.command';
import { CancelSubscriptionCommand } from './cqrs/command/cancel-subscription.command';
import { UpdateAccountStatusCommand } from './cqrs/command/update-account-status.command';
import { UserAccountStatusEnum } from '../../../user/domain/enum/user-account-status.enum';
import { GetAllActiveSubscriptionQuery } from './cqrs/query/get-all-active-subscription.query';

@Injectable()
export class SubscriptionService {
  private readonly monthlySubscriptionPriceId: string;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    private readonly stripeService: StripeService,
    private readonly priceService: PriceService,
    private readonly configService: ConfigService,
  ) {
    this.monthlySubscriptionPriceId = this.configService.get('STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID') ?? 'error';
  }

  async createMonthlySubscription(stripCustomerId: string): Promise<Stripe.Response<Stripe.Subscription>> {
    const subscription: Stripe.ApiList<Stripe.Subscription> = await this.stripeService.getListSubscription(
      stripCustomerId,
      this.monthlySubscriptionPriceId,
    );

    if (subscription.data.length > 0) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'SubscriptionService',
          error: 'User already have a subscription',
          localisation: 'stripe.subscriptions.list',
        }),
      );
      throw new BadRequestException('User already have a subscription');
    }
    return await this.stripeService.createSubscription(stripCustomerId, this.monthlySubscriptionPriceId);
  }

  async getListSubscription(stripCustomerId: string): Promise<Stripe.ApiList<Stripe.Subscription>> {
    const subscription: Stripe.ApiList<Stripe.Subscription> = await this.stripeService.getListSubscription(
      stripCustomerId,
      this.monthlySubscriptionPriceId,
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

  async updateMonthlySubscriptionStatus(
    stripCustomerId: string,
    subscriptionStatus:
      | 'active'
      | 'canceled'
      | 'incomplete'
      | 'incomplete_expired'
      | 'past_due'
      | 'paused'
      | 'trialing'
      | 'unpaid',
  ): Promise<void> {
    return await this.commandBus.execute(
      new UpdateMonthlySubscriptionStatusCommand({
        stripCustomerId: stripCustomerId,
        subscriptionStatus: subscriptionStatus,
      }),
    );
  }

  async createSubscription(
    userId: string,
    stripeCustomerId: string,
    createSubscriptionRequest: CreateSubscriptionRequest,
  ): Promise<Stripe.Response<Stripe.Subscription>> {
    const subscription: Stripe.ApiList<Stripe.Subscription> = await this.stripeService.getListSubscription(
      stripeCustomerId,
      createSubscriptionRequest.priceId,
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

    const price: PriceResponse = await this.priceService.getPriceById(createSubscriptionRequest.priceId);
    if (price.active) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'SubscriptionService',
          error: 'Price is not active',
          localisation: 'stripe.subscriptions.list',
        }),
      );
      throw new BadRequestException('Price is not active');
    }

    if (createSubscriptionRequest.referralCode) {
      const user: UserEntity = await this.queryBus.execute(
        new GetUserWithReferralCodeByUserIdQuery({
          userId: userId,
        }),
      );

      if (user.referralCode === createSubscriptionRequest.referralCode) {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'SubscriptionService',
            error: 'You can not use your own referral code',
            localisation: 'stripe.subscriptions.list',
          }),
        );
        throw new BadRequestException('You can not use your own referral code');
      }

      if (user.usedReferralCodes) {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'SubscriptionService',
            error: 'You already used a referral code',
            localisation: 'stripe.subscriptions.list',
          }),
        );
        throw new BadRequestException('You already used a referral code');
      }
    }

    const stripeSubscription = await this.stripeService.createSubscription(
      stripeCustomerId,
      createSubscriptionRequest.priceId,
      createSubscriptionRequest.referralCode,
    );

    await this.commandBus
      .execute(
        new CreateSubscriptionCommand({
          userId: userId,
          priceId: price.id,
          subscriptionStripeId: stripeSubscription.id,
        }),
      )
      .catch(async error => {
        if (error.message === 'Error while saving subscription') throw new InternalServerErrorException(error.message);
        throw error;
      });

    await this.commandBus
      .execute(
        new CreateUsedReferralCodeCommand({
          userId: userId,
          referralCode: createSubscriptionRequest.referralCode,
          subscriptionId: stripeSubscription.id,
        }),
      )
      .catch(async error => {
        if (error.message === 'Error while saving referral code') throw new InternalServerErrorException(error.message);
        throw error;
      });

    return stripeSubscription;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.commandBus
      .execute(
        new CancelSubscriptionCommand({
          subscriptionId: subscriptionId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Error while canceling subscription')
          throw new InternalServerErrorException(error.message);
        throw error;
      });
  }

  async handlerUserCancelSubscription(userId: string, stipeUserId: string, subscriptionId: string): Promise<void> {
    const stripSubscription: Stripe.Subscription = await this.stripeService.getSubscription(subscriptionId);

    await this.stripeService.cancelSubscription(stipeUserId, stripSubscription.id);
    await this.cancelSubscription(subscriptionId);
    await this.updateUserSubscriptionEnum(userId, UserAccountStatusEnum.FREE);
  }

  updateUserSubscriptionEnum(userId: string, subscriptionStatus: UserAccountStatusEnum): Promise<void> {
    return this.commandBus
      .execute(
        new UpdateAccountStatusCommand({
          status: subscriptionStatus,
          userId: userId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Error while updating subscription')
          throw new InternalServerErrorException(error.message);
        throw error;
      });
  }

  async getAllActiveSubscriptionsCount() {
    return await this.queryBus.execute(new GetAllActiveSubscriptionQuery());
  }
}

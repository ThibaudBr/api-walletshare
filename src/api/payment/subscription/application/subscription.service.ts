import { BadRequestException, Injectable } from '@nestjs/common';
import { StripeService } from '../../stripe/application/stripe.service';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { ErrorCustomEvent } from '../../../../util/exception/error-handler/error-custom.event';
import { UpdateMonthlySubscriptionStatusCommand } from './cqrs/command/update-monthly-subscription-status.command';

@Injectable()
export class SubscriptionService {
  private readonly monthlySubscriptionPriceId: string;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    private readonly stripeService: StripeService,
  ) {
    this.monthlySubscriptionPriceId = process.env.STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID || 'error';
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
}

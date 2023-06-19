import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, SoftRemoveEvent } from 'typeorm';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';
import Stripe from 'stripe';
import * as process from 'process';

@EventSubscriber()
export class StripeSubscriptionSubscriber implements EntitySubscriberInterface<SubscriptionEntity> {
  private stripe: Stripe;

  constructor() {
    if (process.env.NODE_ENV == 'prod') {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PROD ?? 'error', {
        apiVersion: '2022-11-15',
      });
    } else {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST ?? 'error', {
        apiVersion: '2022-11-15',
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return SubscriptionEntity;
  }

  async beforeRemove(event: RemoveEvent<SubscriptionEntity>): Promise<void> {
    const removedSubscription: SubscriptionEntity | undefined = event.entity;
    await this.stripe.subscriptions.cancel(removedSubscription?.subscriptionStripeId ?? 'error').catch(() => {
      return;
    });
  }

  async beforeSoftRemove(event: SoftRemoveEvent<SubscriptionEntity>): Promise<void> {
    const softRemovedSubscription: SubscriptionEntity | undefined = event.entity;
    await this.stripe.subscriptions.cancel(softRemovedSubscription?.subscriptionStripeId ?? 'error').catch(() => {
      return;
    });
  }
}

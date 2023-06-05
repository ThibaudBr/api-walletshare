import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { GetListSubscriptionStripeQuery } from '../../query/get-list-subscription-stripe.query';
import { ConfigService } from '@nestjs/config';

@QueryHandler(GetListSubscriptionStripeQuery)
export class GetListSubscriptionStripeQueryHandler implements IQueryHandler<GetListSubscriptionStripeQuery> {
  private stripe: Stripe;

  constructor(private readonly eventBus: EventBus, private readonly configService: ConfigService) {
    if (this.configService.get('NODE_ENV') == 'prod') {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_PROD') || 'error', {
        apiVersion: '2022-11-15',
      });
    } else {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_TEST') || 'error', {
        apiVersion: '2022-11-15',
      });
    }
  }

  async execute(query: GetListSubscriptionStripeQuery): Promise<Stripe.ApiList<Stripe.Subscription>> {
    return this.stripe.subscriptions
      .list({
        customer: query.stripeCustomerId,
        price: query.priceId,
        expand: ['data.latest_invoice', 'data.latest_invoice.payment_intent'],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetListSubscriptionStripQueryHandler',
            error: error,
            localisation: 'stripe.subscriptions.list',
          }),
        );
        throw new Error('Error while fetching list of subscription');
      });
  }
}

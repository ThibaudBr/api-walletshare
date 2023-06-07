import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllSubscriptionFromCustomerIdStripeQuery } from '../../query/get-all-subscription-from-customer-id-stripe.query';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllSubscriptionFromCustomerIdStripeQuery)
export class GetAllSubscriptionFromCustomerIdStripeQueryHandler
  implements IQueryHandler<GetAllSubscriptionFromCustomerIdStripeQuery>
{
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

  async execute(query: GetAllSubscriptionFromCustomerIdStripeQuery): Promise<Stripe.ApiList<Stripe.Subscription>> {
    return await this.stripe.subscriptions
      .list({
        customer: query.customerId,
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'payment',
            handler: 'GetAllSubscriptionFromCustomerIdStripeQueryHandler',
            error: error,
          }),
        );
        throw new Error('Error during the listing of the subscriptions');
      });
  }
}

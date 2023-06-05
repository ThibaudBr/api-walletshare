import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { GetAllPriceStripeQuery } from '../../query/get-all-price-stripe.query';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllPriceStripeQuery)
export class GetAllPriceStripeQueryHandler implements IQueryHandler<GetAllPriceStripeQuery> {
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

  async execute(query: GetAllPriceStripeQuery): Promise<Stripe.ApiList<Stripe.Price>> {
    return await this.stripe.prices
      .list({
        limit: query.limit,
        active: true,
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'payment', handler: 'GetAllPriceStripeQueryHandler', error: error }),
        );
        throw new Error('Error during the get of the prices');
      });
  }
}

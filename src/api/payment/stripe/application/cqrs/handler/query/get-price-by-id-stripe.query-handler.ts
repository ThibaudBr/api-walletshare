import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { GetPriceByIdStripeQuery } from '../../query/get-price-by-id-stripe.query';

@QueryHandler(GetPriceByIdStripeQuery)
export class GetPriceByIdStripeQueryHandler implements IQueryHandler<GetPriceByIdStripeQuery> {
  private stripe: Stripe;

  constructor(private readonly eventBus: EventBus, private readonly configService: ConfigService) {
    if (this.configService.get('NODE_ENV') == 'prod') {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_PROD') ?? 'error', {
        apiVersion: '2022-11-15',
        maxNetworkRetries: 2,
      });
    } else {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_TEST') ?? 'error', {
        apiVersion: '2022-11-15',
        maxNetworkRetries: 2,
      });
    }
  }

  async execute(query: GetPriceByIdStripeQuery): Promise<Stripe.Price> {
    return await this.stripe.prices.retrieve(query.priceStripeId).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'payment', handler: 'GetPriceByIdStripeQueryHandler', error: error }),
      );
      throw new Error('Error during the get of the price');
    });
  }
}

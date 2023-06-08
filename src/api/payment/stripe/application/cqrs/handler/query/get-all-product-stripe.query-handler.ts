import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { GetAllProductStripeQuery } from '../../query/get-all-product-stripe.query';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllProductStripeQuery)
export class GetAllProductStripeQueryHandler implements IQueryHandler<GetAllProductStripeQuery> {
  private stripe: Stripe;

  constructor(private readonly eventBus: EventBus, private readonly configService: ConfigService) {
    if (this.configService.get('NODE_ENV') == 'prod') {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_PROD') ?? 'error', {
        apiVersion: '2022-11-15',
      });
    } else {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_TEST') ?? 'error', {
        apiVersion: '2022-11-15',
      });
    }
  }

  async execute(query: GetAllProductStripeQuery): Promise<Stripe.Response<Stripe.ApiList<Stripe.Product>>> {
    return await this.stripe.products
      .list({
        limit: query.limit,
        starting_after: query.offset,
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'payment', handler: 'GetAllProductStripeQueryHandler', error: error }),
        );
        throw new Error('Error during the listing of the products');
      });
  }
}

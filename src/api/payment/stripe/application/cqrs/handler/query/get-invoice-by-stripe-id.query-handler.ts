import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { GetInvoiceByStripeIdQuery } from '../../query/get-invoice-by-stripe-id.query';

@QueryHandler(GetInvoiceByStripeIdQuery)
export class GetInvoiceByStripeIdQueryHandler implements IQueryHandler<GetInvoiceByStripeIdQuery> {
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

  async execute(query: GetInvoiceByStripeIdQuery): Promise<Stripe.Response<Stripe.Invoice>> {
    return await this.stripe.invoices.retrieve(query.stripeInvoiceId).catch(error => {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'payment', handler: 'GetInvoiceByStripeIdQueryHandler', error: error }),
      );
      throw new Error('Error during the retrieve of the invoice');
    });
  }
}

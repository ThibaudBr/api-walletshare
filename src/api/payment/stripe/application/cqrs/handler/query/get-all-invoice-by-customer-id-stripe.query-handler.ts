import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllInvoiceByCustomerIdStripeQuery } from '../../query/get-all-invoice-by-customer-id-stripe.query';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllInvoiceByCustomerIdStripeQuery)
export class GetAllInvoiceByCustomerIdStripeQueryHandler
  implements IQueryHandler<GetAllInvoiceByCustomerIdStripeQuery>
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

  async execute(query: GetAllInvoiceByCustomerIdStripeQuery): Promise<Stripe.ApiList<Stripe.Invoice>> {
    return await this.stripe.invoices
      .list({
        customer: query.customerId,
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'payment',
            handler: 'GetAllInvoiceByCustomerIdStripeQueryHandler',
            error: error,
          }),
        );
        throw new Error('Error during the listing of the invoices');
      });
  }
}

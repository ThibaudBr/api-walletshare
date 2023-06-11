import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { StripeService } from '../../stripe/application/stripe.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly stripeService: StripeService,
  ) {}

  async getAllMyInvoices(stripeCustomerId: string): Promise<Stripe.ApiList<Stripe.Invoice>> {
    return await this.stripeService.getAllInvoiceByCustomerId(stripeCustomerId);
  }
}

import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetListSavedCreditCardOfUserQuery } from '../../query/get-list-saved-credit-card-of-user.query';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@QueryHandler(GetListSavedCreditCardOfUserQuery)
export class GetListSavedCreditCardOfUserQueryHandler implements IQueryHandler<GetListSavedCreditCardOfUserQuery> {
  private stripe: Stripe;

  constructor(private readonly eventBus: EventBus, private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY') || 'error', {
      apiVersion: '2022-11-15',
    });
  }

  async execute(query: GetListSavedCreditCardOfUserQuery): Promise<Stripe.ApiList<Stripe.PaymentMethod>> {
    return this.stripe.paymentMethods.list({
      customer: query.stripeCustomerId,
      type: 'card',
    });
  }
}

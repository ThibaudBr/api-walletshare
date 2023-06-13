import { PriceEntity } from '../../../../price/domain/entities/price.entity';
import Stripe from 'stripe';

export class UpdateSubscriptionCommand {
  public readonly latestInvoiceId: string;
  public readonly priceEntity: PriceEntity;
  public readonly stripeSubscription: Stripe.Subscription;

  constructor(partial: Partial<UpdateSubscriptionCommand>) {
    Object.assign(this, partial);
  }
}

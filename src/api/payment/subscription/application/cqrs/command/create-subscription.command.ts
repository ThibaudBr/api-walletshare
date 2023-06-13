import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import { PriceEntity } from '../../../../price/domain/entities/price.entity';
import Stripe from 'stripe';

export class CreateSubscriptionCommand {
  constructor(partial: Partial<CreateSubscriptionCommand>) {
    Object.assign(this, partial);
  }

  public readonly userEntity: UserEntity;
  public readonly priceEntity: PriceEntity;
  public readonly stripeSubscription: Stripe.Subscription;
  public readonly latestInvoiceId: string;
}

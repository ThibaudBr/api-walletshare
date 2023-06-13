import { SubscriptionEntity } from '../../../../subscription/domain/entities/subscription.entity';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import Stripe from 'stripe';

export class CreateInvoiceCommand {
  constructor(partial: Partial<CreateInvoiceCommand>) {
    Object.assign(this, partial);
  }

  public readonly userEntity: UserEntity;
  public readonly subscriptionEntity: SubscriptionEntity;
  public readonly stripeInvoice: Stripe.Invoice;
}

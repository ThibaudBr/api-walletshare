export class CreateSubscriptionStripeEvent {
  public readonly stripeCustomerId: string;
  public readonly priceId: string;
  public readonly methode: string = 'create-subscription-stripe';
  public readonly module: string = 'stripe';

  constructor(partial: Partial<CreateSubscriptionStripeEvent>) {
    Object.assign(this, partial);
  }
}

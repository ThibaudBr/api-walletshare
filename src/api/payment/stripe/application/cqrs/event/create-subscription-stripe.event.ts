export class CreateSubscriptionStripeEvent {
  constructor(partial: Partial<CreateSubscriptionStripeEvent>) {
    Object.assign(this, partial);
  }

  public readonly stripeCustomerId: string;
  public readonly priceId: string;
  public readonly methode: string = 'create-subscription-stripe';
  public readonly module: string = 'payment';
}

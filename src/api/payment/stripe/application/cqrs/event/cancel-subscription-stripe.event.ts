export class CancelSubscriptionStripeEvent {
  constructor(partial: Partial<CancelSubscriptionStripeEvent>) {
    Object.assign(this, partial);
  }

  public readonly stripeCustomerId: string;
  public readonly subscriptionId: string;
  public readonly method: string = 'cancel-subscription-stripe';
  public readonly module: string = 'payment';
}

export class CancelSubscriptionStripeEvent {
  public readonly stripeCustomerId: string;
  public readonly subscriptionId: string;
  public readonly method: string = 'cancel-subscription-stripe';
  public readonly module: string = 'stripe';

  constructor(partial: Partial<CancelSubscriptionStripeEvent>) {
    Object.assign(this, partial);
  }
}

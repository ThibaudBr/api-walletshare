export class CancelSubscriptionStripeCommand {
  public readonly stripeCustomerId: string;
  public readonly subscriptionId: string;

  constructor(partial: Partial<CancelSubscriptionStripeCommand>) {
    Object.assign(this, partial);
  }
}

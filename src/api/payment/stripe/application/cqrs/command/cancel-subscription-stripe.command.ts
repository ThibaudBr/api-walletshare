export class CancelSubscriptionStripeCommand {
  constructor(partial: Partial<CancelSubscriptionStripeCommand>) {
    Object.assign(this, partial);
  }

  public readonly stripeCustomerId: string;
  public readonly subscriptionId: string;
}

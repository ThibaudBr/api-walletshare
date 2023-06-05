export class CreateSubscriptionStripeCommand {
  public readonly stripeCustomerId: string;
  public readonly priceId: string;
  public readonly trialPeriod: boolean = false;

  constructor(partial: Partial<CreateSubscriptionStripeCommand>) {
    Object.assign(this, partial);
  }
}

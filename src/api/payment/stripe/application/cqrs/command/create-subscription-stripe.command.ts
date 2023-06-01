export class CreateSubscriptionStripeCommand {
  constructor(partial: Partial<CreateSubscriptionStripeCommand>) {
    Object.assign(this, partial);
  }

  public readonly stripeCustomerId: string;
  public readonly priceId: string;
  public readonly trialPeriod: boolean = false;
}

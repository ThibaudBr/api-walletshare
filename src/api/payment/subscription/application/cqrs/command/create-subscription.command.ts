export class CreateSubscriptionCommand {
  constructor(partial: Partial<CreateSubscriptionCommand>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public readonly priceId: string;
  public readonly trialPeriodDays?: number;
  public readonly subscriptionStripeId: string;
}

export class CreateSubscriptionStripeCommand {
  public readonly stripeCustomerId: string;
  public readonly priceId: string;
  public readonly paymentMethod: string;
  public readonly trialPeriod?: number;
  public readonly promotionCode?: string;
  constructor(partial: Partial<CreateSubscriptionStripeCommand>) {
    Object.assign(this, partial);
  }
}

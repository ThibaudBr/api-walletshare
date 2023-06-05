export class CreatePriceStripeRequest {
  public readonly productId: string;
  public readonly unitAmount: number;
  public readonly interval: string;
  public usageType: string;
  public readonly productStripeId: string;
  public readonly active: boolean;
  public readonly trialPeriodDays: number;
  public readonly intervalCount: number;

  constructor(partial: Partial<CreatePriceStripeRequest>) {
    Object.assign(this, partial);
  }
}

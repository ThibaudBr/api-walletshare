export class CreatePriceStripeCommand {
  public readonly productId: string;
  public readonly productStripeId: string;
  public readonly unitAmount: number;
  public readonly interval: string;
  public readonly intervalCount: number;
  public readonly usageType: string;
  public readonly trialPeriodDays: number;
  public readonly active: boolean = true;

  constructor(partial: Partial<CreatePriceStripeCommand>) {
    Object.assign(this, partial);
  }
}

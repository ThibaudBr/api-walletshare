export class UpdatePriceRequest {
  public readonly priceId: string;
  public readonly productId: string;
  public readonly unitAmount?: number;
  public readonly interval?: string;
  public usageType?: string;
  public readonly productStripeId: string;
  public readonly active?: boolean;
  public readonly trialPeriodDays?: number;
  public readonly intervalCount?: number;

  constructor(partial: Partial<UpdatePriceRequest>) {
    Object.assign(this, partial);
  }
}

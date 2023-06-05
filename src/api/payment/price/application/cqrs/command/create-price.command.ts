export class CreatePriceCommand {
  public readonly productId: string;
  public readonly priceStripeId: string;
  public readonly jsonStripeMetadata: object;
  public readonly interval: string;
  public readonly intervalCount: number;
  public readonly type: string;
  public readonly unitAmount: number;
  public readonly unitAmountDecimal: string;
  public readonly active: boolean;

  constructor(partial: Partial<CreatePriceCommand>) {
    Object.assign(this, partial);
  }
}

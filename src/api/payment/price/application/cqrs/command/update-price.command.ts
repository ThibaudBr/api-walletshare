export class UpdatePriceCommand {
  public readonly priceId: string;
  public readonly stripePriceId: string;
  public readonly name: string;
  public readonly amount: number;
  public readonly currency: string;
  public readonly interval: string;
  public readonly intervalCount: number;
  public readonly unitAmount: number;
  public readonly type: string;
  public readonly unitAmountDecimal: string;
  public readonly active: boolean;
  public readonly jsonStripeMetadata: object;

  constructor(partial: Partial<UpdatePriceCommand>) {
    Object.assign(this, partial);
  }
}

export class PriceResponse {
  public readonly id: string;
  public readonly price: number;
  public readonly currency: string;
  public readonly stripePriceId: string;
  public readonly interval: string;
  public readonly type: string;
  public readonly active: boolean;
  public readonly unitAmount: number;
  public readonly unitAmountDecimal: number;
  public readonly jsonStripeMetadata?: object;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  constructor(partial: Partial<PriceResponse>) {
    Object.assign(this, partial);
  }
}

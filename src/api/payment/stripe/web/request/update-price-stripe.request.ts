export class UpdatePriceStripeRequest {
  public readonly priceStripeId: string;
  public readonly active: boolean;
  public readonly productId: string;
  public readonly priceId: string;

  constructor(partial: Partial<UpdatePriceStripeRequest>) {
    Object.assign(this, partial);
  }
}

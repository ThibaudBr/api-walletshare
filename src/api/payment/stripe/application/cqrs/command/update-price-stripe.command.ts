export class UpdatePriceStripeCommand {
  public readonly priceStripeId: string;
  public readonly priceId: string;
  public readonly productId: string;
  public readonly active: boolean = true;

  constructor(partial: Partial<UpdatePriceStripeCommand>) {
    Object.assign(this, partial);
  }
}

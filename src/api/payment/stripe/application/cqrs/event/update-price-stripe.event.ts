export class UpdatePriceStripeEvent {
  public readonly productStripeId: string;
  public readonly priceStripeId: string;
  public readonly method: string = 'update-price-stripe';
  public readonly module: string = 'stripe';

  constructor(partial: Partial<UpdatePriceStripeEvent>) {
    Object.assign(this, partial);
  }
}

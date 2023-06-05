export class CreatePriceStripeEvent {
  public readonly priceStripeId: string;
  public readonly productId: string;
  public readonly module: string = 'stripe';
  public readonly method: string = 'create-price';

  constructor(partial: Partial<CreatePriceStripeEvent>) {
    Object.assign(this, partial);
  }
}

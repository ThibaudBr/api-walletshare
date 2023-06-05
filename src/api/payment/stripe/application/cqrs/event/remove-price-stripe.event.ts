export class RemovePriceStripeEvent {
  public readonly priceStripeId: string;
  public readonly method: string = 'remove-price-stripe';
  public readonly module: string = 'stripe';

  constructor(partial: Partial<RemovePriceStripeEvent>) {
    Object.assign(this, partial);
  }
}

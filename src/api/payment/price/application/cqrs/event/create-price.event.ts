export class CreatePriceEvent {
  public readonly priceId: string;
  public readonly priceStripeId: string;
  public readonly productId: string;
  public readonly method: string = 'create-price';
  public readonly module: string = 'price';

  constructor(partial: Partial<CreatePriceEvent>) {
    Object.assign(this, partial);
  }
}

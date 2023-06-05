export class RemovePriceEvent {
  public readonly priceId: string;
  public readonly method: string = 'remove-price';
  public readonly module: string = 'price';

  constructor(partial: Partial<RemovePriceEvent>) {
    Object.assign(this, partial);
  }
}

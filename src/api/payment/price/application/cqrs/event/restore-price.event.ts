export class RestorePriceEvent {
  public readonly priceId: string;
  public readonly method: string = 'restore-price';
  public readonly module: string = 'price';

  constructor(partial: Partial<RestorePriceEvent>) {
    Object.assign(this, partial);
  }
}

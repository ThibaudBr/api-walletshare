export class SoftRemovePriceEvent {
  public readonly priceId: string;
  public readonly method: string = 'soft-remove-price';
  public readonly module: string = 'price';

  constructor(partial: Partial<SoftRemovePriceEvent>) {
    Object.assign(this, partial);
  }
}

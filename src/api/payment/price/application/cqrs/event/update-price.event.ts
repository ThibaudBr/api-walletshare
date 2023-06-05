export class UpdatePriceEvent {
  public readonly priceId: string;
  public readonly method: string = 'update-price';
  public readonly module: string = 'price';

  constructor(partial: Partial<UpdatePriceEvent>) {
    Object.assign(this, partial);
  }
}

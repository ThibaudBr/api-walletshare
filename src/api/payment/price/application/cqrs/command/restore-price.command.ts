export class RestorePriceCommand {
  public readonly priceId: string;

  constructor(partial: Partial<RestorePriceCommand>) {
    Object.assign(this, partial);
  }
}

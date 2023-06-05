export class RemovePriceCommand {
  public readonly priceId: string;

  constructor(partial: Partial<RemovePriceCommand>) {
    Object.assign(this, partial);
  }
}

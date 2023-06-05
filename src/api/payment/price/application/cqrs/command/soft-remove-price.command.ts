export class SoftRemovePriceCommand {
  public readonly priceId: string;

  constructor(partial: Partial<SoftRemovePriceCommand>) {
    Object.assign(this, partial);
  }
}

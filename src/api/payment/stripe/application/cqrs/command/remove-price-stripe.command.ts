export class RemovePriceStripeCommand {
  public readonly priceStripeId: string;

  constructor(partial: Partial<RemovePriceStripeCommand>) {
    Object.assign(this, partial);
  }
}

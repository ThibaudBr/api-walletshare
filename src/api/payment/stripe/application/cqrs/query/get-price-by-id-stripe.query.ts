export class GetPriceByIdStripeQuery {
  public readonly priceStripeId: string;

  constructor(partial: Partial<GetPriceByIdStripeQuery>) {
    Object.assign(this, partial);
  }
}

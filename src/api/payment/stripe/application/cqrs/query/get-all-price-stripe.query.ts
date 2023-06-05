export class GetAllPriceStripeQuery {
  public readonly limit: number;

  constructor(partial: Partial<GetAllPriceStripeQuery>) {
    Object.assign(this, partial);
  }
}

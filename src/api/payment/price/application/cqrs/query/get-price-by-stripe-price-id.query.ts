export class GetPriceByStripePriceIdQuery {
  public readonly stripePriceId: string;

  constructor(partial: Partial<GetPriceByStripePriceIdQuery>) {
    Object.assign(this, partial);
  }
}

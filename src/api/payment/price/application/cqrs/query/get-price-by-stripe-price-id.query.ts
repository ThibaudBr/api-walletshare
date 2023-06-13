export class GetPriceByStripePriceIdQuery {
  constructor(partial: Partial<GetPriceByStripePriceIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly stripePriceId: string;
}

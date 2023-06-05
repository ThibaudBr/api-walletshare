export class GetAllPriceByProductIdQuery {
  public readonly productId: string;

  constructor(partial: Partial<GetAllPriceByProductIdQuery>) {
    Object.assign(this, partial);
  }
}

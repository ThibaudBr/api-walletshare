export class GetAllProductQuery {
  constructor(partial: Partial<GetAllProductQuery>) {
    Object.assign(this, partial);
  }

  public readonly offset: number;
  public readonly limit: number;
}

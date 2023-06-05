export class GetAllProductQuery {
  public readonly offset: number;
  public readonly limit: number;

  constructor(partial: Partial<GetAllProductQuery>) {
    Object.assign(this, partial);
  }
}

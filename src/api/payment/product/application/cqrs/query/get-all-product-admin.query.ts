export class GetAllProductAdminQuery {
  public readonly offset: number;
  public readonly limit: number;

  constructor(partial: Partial<GetAllProductAdminQuery>) {
    Object.assign(this, partial);
  }
}

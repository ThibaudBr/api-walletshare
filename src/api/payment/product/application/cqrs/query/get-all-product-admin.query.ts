export class GetAllProductAdminQuery {
  constructor(partial: Partial<GetAllProductAdminQuery>) {
    Object.assign(this, partial);
  }

  public readonly offset: number;
  public readonly limit: number;
}

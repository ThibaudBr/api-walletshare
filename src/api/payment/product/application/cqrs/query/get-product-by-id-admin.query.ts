export class GetProductByIdAdminQuery {
  public readonly id: string;

  constructor(partial: Partial<GetProductByIdAdminQuery>) {
    Object.assign(this, partial);
  }
}

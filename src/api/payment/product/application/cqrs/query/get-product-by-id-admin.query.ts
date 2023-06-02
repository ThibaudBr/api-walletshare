export class GetProductByIdAdminQuery {
  constructor(partial: Partial<GetProductByIdAdminQuery>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}

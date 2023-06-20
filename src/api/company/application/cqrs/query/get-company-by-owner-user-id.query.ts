export class GetCompanyByOwnerUserIdQuery {
  public readonly userId: string;

  constructor(partial: Partial<GetCompanyByOwnerUserIdQuery>) {
    Object.assign(this, partial);
  }
}

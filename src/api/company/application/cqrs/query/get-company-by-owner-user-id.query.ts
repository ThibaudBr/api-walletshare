export class GetCompanyByOwnerUserIdQuery {
  constructor(partial: Partial<GetCompanyByOwnerUserIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
}

export class GetCompanyByIdQuery {
  public readonly companyId: string;

  constructor(partial: Partial<GetCompanyByIdQuery>) {
    Object.assign(this, partial);
  }
}

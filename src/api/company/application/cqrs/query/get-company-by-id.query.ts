export class GetCompanyByIdQuery {
  public readonly companyId: string;
  public readonly fullCompany: boolean = false;

  constructor(partial: Partial<GetCompanyByIdQuery>) {
    Object.assign(this, partial);
  }
}

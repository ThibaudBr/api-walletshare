export class GetEmployeeByCompanyIdQuery {
  public readonly companyId: string;

  constructor(partial: Partial<GetEmployeeByCompanyIdQuery>) {
    Object.assign(this, partial);
  }
}

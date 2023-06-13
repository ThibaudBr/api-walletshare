export class AddCompanyEmployeeRequest {
  public readonly companyId: string;
  public readonly userId: string;

  constructor(partial: Partial<AddCompanyEmployeeRequest>) {
    Object.assign(this, partial);
  }
}

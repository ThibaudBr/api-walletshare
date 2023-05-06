export class RemoveCompanyEmployeeRequest {
  public readonly companyId: string;
  public readonly profileId: string;

  constructor(partial: Partial<RemoveCompanyEmployeeRequest>) {
    Object.assign(this, partial);
  }
}

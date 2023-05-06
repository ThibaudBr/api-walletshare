export class RemoveCompanyEmployeeEvent {
  public readonly companyId: string;
  public readonly profileId: string;
  public readonly module: string = 'company';
  public readonly method: string = 'remove-company-employee';

  constructor(partial: Partial<RemoveCompanyEmployeeEvent>) {
    Object.assign(this, partial);
  }
}

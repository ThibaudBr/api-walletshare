export class RemoveCompanyEmployeeCommand {
  public readonly companyId: string;
  public readonly profileId: string;

  constructor(partial: Partial<RemoveCompanyEmployeeCommand>) {
    Object.assign(this, partial);
  }
}

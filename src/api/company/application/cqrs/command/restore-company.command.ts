export class RestoreCompanyCommand {
  public readonly companyId: string;

  constructor(partial: Partial<RestoreCompanyCommand>) {
    Object.assign(this, partial);
  }
}

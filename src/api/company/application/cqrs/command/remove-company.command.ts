export class RemoveCompanyCommand {
  public readonly companyId: string;

  constructor(partial: Partial<RemoveCompanyCommand>) {
    Object.assign(this, partial);
  }
}

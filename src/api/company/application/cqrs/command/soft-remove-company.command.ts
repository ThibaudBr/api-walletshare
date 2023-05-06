export class SoftRemoveCompanyCommand {
  public readonly companyId: string;

  constructor(partial: Partial<SoftRemoveCompanyCommand>) {
    Object.assign(this, partial);
  }
}

export class SoftRemoveCompanyEvent {
  public readonly companyId: string;
  public readonly module: string = 'company';
  public readonly method: string = 'soft-remove-company';

  constructor(partial: Partial<SoftRemoveCompanyEvent>) {
    Object.assign(this, partial);
  }
}

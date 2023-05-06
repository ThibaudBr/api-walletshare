export class RemoveCompanyEvent {
  public readonly companyId: string;
  public readonly module: string = 'company';
  public readonly method: string = 'remove-company';

  constructor(partial: Partial<RemoveCompanyEvent>) {
    Object.assign(this, partial);
  }
}

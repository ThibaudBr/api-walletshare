export class RestoreCompanyEvent {
  public readonly companyId: string;
  public readonly module: string = 'company';
  public readonly method: string = 'restore-company';

  constructor(partial: Partial<RestoreCompanyEvent>) {
    Object.assign(this, partial);
  }
}

export class UpdateCompanyEvent {
  public readonly companyId: string;
  public readonly module: string = 'company';
  public readonly method: string = 'update-company';

  constructor(partial: Partial<UpdateCompanyEvent>) {
    Object.assign(this, partial);
  }
}

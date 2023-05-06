export class CreateCompanyEvent {
  public readonly module: string = 'company';
  public readonly method: string = 'create-company';
  public readonly companyId: string;
  public readonly profileId: string;

  constructor(partial: Partial<CreateCompanyEvent>) {
    Object.assign(this, partial);
  }
}

export class TransferOwnershipOfCompanyEvent {
  public readonly module: string = 'company';
  public readonly method: string = 'transfer-ownership-of-company';
  public readonly companyId: string;
  public readonly profileId: string;

  constructor(partial: Partial<TransferOwnershipOfCompanyEvent>) {
    Object.assign(this, partial);
  }
}

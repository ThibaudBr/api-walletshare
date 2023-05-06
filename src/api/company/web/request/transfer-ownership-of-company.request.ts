export class TransferOwnershipOfCompanyRequest {
  public readonly companyId: string;
  public readonly profileId: string;

  constructor(partial: Partial<TransferOwnershipOfCompanyRequest>) {
    Object.assign(this, partial);
  }
}

export class TransferOwnershipOfCompanyCommand {
  public readonly companyId: string;
  public readonly profileId: string;

  constructor(partial: Partial<TransferOwnershipOfCompanyCommand>) {
    Object.assign(this, partial);
  }
}

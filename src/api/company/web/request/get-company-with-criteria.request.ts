export class GetCompanyWithCriteriaRequest {
  public readonly isDeleted?: boolean;
  public readonly companyId?: string;
  constructor(partial: Partial<GetCompanyWithCriteriaRequest>) {
    Object.assign(this, partial);
  }
}

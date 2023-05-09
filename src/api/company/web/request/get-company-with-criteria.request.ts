export class GetCompanyWithCriteriaRequest {
  public readonly isDeleted?: boolean;

  constructor(partial: Partial<GetCompanyWithCriteriaRequest>) {
    Object.assign(this, partial);
  }
}

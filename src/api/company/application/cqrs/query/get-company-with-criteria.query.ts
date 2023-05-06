export class GetCompanyWithCriteriaQuery {
  public readonly isDeleted?: boolean;

  constructor(partial: Partial<GetCompanyWithCriteriaQuery>) {
    Object.assign(this, partial);
  }
}

export class GetCompanyWithCriteriaQuery {
  public readonly isDeleted?: boolean;
  public readonly id?: string;

  constructor(partial: Partial<GetCompanyWithCriteriaQuery>) {
    Object.assign(this, partial);
  }
}

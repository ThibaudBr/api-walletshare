export class GetGroupRequestWithCriteriaRequest {
  constructor(partial: Partial<GetGroupRequestWithCriteriaRequest>) {
    Object.assign(this, partial);
  }

  public id?: string;
  public isDeleted?: boolean;
  public groupId?: string;
  public cardId?: string;
}

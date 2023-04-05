export class GetGroupRequestWithCriteriaQuery {
  constructor(partial: Partial<GetGroupRequestWithCriteriaQuery>) {
    Object.assign(this, partial);
  }

  public id?: string;
  public isDeleted?: boolean;
  public groupId?: string;
  public cardId?: string;
}

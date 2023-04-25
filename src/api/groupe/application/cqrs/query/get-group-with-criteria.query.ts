export class GetGroupWithCriteriaQuery {
  constructor(partial: Partial<GetGroupWithCriteriaQuery>) {
    Object.assign(this, partial);
  }

  public cardId?: string;
  public isDeleted?: boolean;
  public name?: string;
  createAtFrom?: Date;
  createAtTo?: Date;
  updateAtFrom?: Date;
  updateAtTo?: Date;
  deleteAtFrom?: Date;
  deleteAtTo?: Date;
}

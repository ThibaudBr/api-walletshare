export class GetGroupWithCriteriaRequest {
  public cardId?: string;
  public isDeleted?: boolean;
  public name?: string;
  createAtFrom?: Date;
  createAtTo?: Date;
  updateAtFrom?: Date;
  updateAtTo?: Date;
  deleteAtFrom?: Date;
  deleteAtTo?: Date;

  constructor(partial: Partial<GetGroupWithCriteriaRequest>) {
    Object.assign(this, partial);
  }
}
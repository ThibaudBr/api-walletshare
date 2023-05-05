export class GetOccupationWithCriteriaRequest {
  public readonly name: string;
  public readonly isDeleted: boolean;

  constructor(partial: Partial<GetOccupationWithCriteriaRequest>) {
    Object.assign(this, partial);
  }
}

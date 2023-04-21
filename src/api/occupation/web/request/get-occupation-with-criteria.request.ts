export class GetOccupationWithCriteriaRequest {
  constructor(partial: Partial<GetOccupationWithCriteriaRequest>) {
    Object.assign(this, partial);
  }

  public readonly name: string;
  public readonly isDeleted: boolean;
}

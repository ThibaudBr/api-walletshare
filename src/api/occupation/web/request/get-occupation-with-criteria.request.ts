export class GetOccupationWithCriteriaRequest {
  constructor(partial: Partial<GetOccupationWithCriteriaRequest>) {
    Object.assign(partial);
  }

  public readonly name: string;
  public readonly isDeleted: boolean;
}

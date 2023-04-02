export class GetOccupationWithCriteriaDto {
  constructor(partial: Partial<GetOccupationWithCriteriaDto>) {
    Object.assign(partial);
  }

  public readonly name: string;
  public readonly isDeleted: boolean;
}

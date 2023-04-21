export class GetOccupationWithCriteriaDto {
  constructor(partial: Partial<GetOccupationWithCriteriaDto>) {
    Object.assign(this, partial);
  }

  public readonly name: string;
  public readonly isDeleted: boolean;
}

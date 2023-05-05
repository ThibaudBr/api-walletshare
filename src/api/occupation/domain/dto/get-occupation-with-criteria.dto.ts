export class GetOccupationWithCriteriaDto {
  public readonly name: string;
  public readonly isDeleted: boolean;

  constructor(partial: Partial<GetOccupationWithCriteriaDto>) {
    Object.assign(this, partial);
  }
}

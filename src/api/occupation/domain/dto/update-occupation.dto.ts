export class UpdateOccupationDto {
  public readonly name: string;

  constructor(partial: Partial<UpdateOccupationDto>) {
    Object.assign(this, partial);
  }
}

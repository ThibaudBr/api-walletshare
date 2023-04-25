export class UpdateOccupationDto {
  constructor(partial: Partial<UpdateOccupationDto>) {
    Object.assign(this, partial);
  }

  public readonly name: string;
}

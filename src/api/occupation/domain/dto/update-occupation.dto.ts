export class UpdateOccupationDto {
  constructor(partial: Partial<UpdateOccupationDto>) {
    Object.assign(partial);
  }

  public readonly name: string;
}

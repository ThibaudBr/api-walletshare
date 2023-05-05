export class CreateOccupationDto {
  public readonly name: string;

  constructor(partial: Partial<CreateOccupationDto>) {
    Object.assign(this, partial);
  }
}

export class CreateOccupationDto {
  constructor(partial: Partial<CreateOccupationDto>) {
    Object.assign(this, partial);
  }

  public readonly name: string;
}

export class CreateOccupationDto {
  constructor(partial: Partial<CreateOccupationDto>) {
    Object.assign(partial);
  }

  public readonly name: string;
}

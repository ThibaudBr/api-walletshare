export class UpdateOccupationsProfileCommand {
  public readonly id: string;
  public readonly occupations: string[];

  constructor(partial: Partial<UpdateOccupationsProfileCommand>) {
    Object.assign(this, partial);
  }
}

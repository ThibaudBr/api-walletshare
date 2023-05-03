export class OccupationDto {
  public readonly id: string;
  public readonly name: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  constructor(partial: Partial<OccupationDto>) {
    Object.assign(this, partial);
  }
}

export class OccupationResponse {
  constructor(partial: Partial<OccupationResponse>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly name: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
}

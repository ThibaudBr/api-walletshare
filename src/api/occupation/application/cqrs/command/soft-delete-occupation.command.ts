export class SoftDeleteOccupationCommand {
  public readonly occupationId: string;

  constructor(partial: Partial<SoftDeleteOccupationCommand>) {
    Object.assign(this, partial);
  }
}

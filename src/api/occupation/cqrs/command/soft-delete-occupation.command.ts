export class SoftDeleteOccupationCommand {
  constructor(partial: Partial<SoftDeleteOccupationCommand>) {
    Object.assign(this, partial);
  }

  public readonly occupationId: string;
}

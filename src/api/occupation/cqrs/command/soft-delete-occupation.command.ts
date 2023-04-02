export class SoftDeleteOccupationCommand {
  constructor(partial: Partial<SoftDeleteOccupationCommand>) {
    Object.assign(partial);
  }

  public readonly occupationId: string;
}

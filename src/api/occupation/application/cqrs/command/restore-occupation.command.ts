export class RestoreOccupationCommand {
  public readonly occupationId: string;

  constructor(partial: Partial<RestoreOccupationCommand>) {
    Object.assign(this, partial);
  }
}

export class RestoreOccupationCommand {
  constructor(partial: Partial<RestoreOccupationCommand>) {
    Object.assign(this, partial);
  }

  public readonly occupationId: string;
}

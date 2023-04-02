export class RestoreOccupationEvent {
  constructor(partial: Partial<RestoreOccupationEvent>) {
    Object.assign(this, partial);
  }

  public readonly occupationId: string;

  public readonly module: string = 'occupation';
  public readonly method: string = 'restore-occupation';
}

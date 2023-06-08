export class RestoreCardPresetEvent {
  constructor(partial: Partial<RestoreCardPresetEvent>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly method: string = 'restore-card-preset';
  public readonly module: string = 'company';
}

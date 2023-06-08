export class RemoveCardPresetEvent {
  constructor(partial: Partial<RemoveCardPresetEvent>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly module: string = 'company';
  public readonly method: string = 'remove-card-preset';
}

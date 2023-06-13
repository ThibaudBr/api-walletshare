export class RemoveCardPresetEvent {
  public readonly id: string;
  public readonly module: string = 'company';
  public readonly method: string = 'remove-card-preset';

  constructor(partial: Partial<RemoveCardPresetEvent>) {
    Object.assign(this, partial);
  }
}

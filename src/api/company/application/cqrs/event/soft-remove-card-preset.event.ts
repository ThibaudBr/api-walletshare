export class SoftRemoveCardPresetEvent {
  constructor(partial: Partial<SoftRemoveCardPresetEvent>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly module: string = 'company';
  public readonly method: string = 'soft-remove-card-preset';
}

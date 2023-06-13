export class SoftRemoveCardPresetEvent {
  public readonly id: string;
  public readonly module: string = 'company';
  public readonly method: string = 'soft-remove-card-preset';

  constructor(partial: Partial<SoftRemoveCardPresetEvent>) {
    Object.assign(this, partial);
  }
}

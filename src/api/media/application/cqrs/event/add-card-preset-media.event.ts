export class AddCardPresetMediaEvent {
  constructor(partial: Partial<AddCardPresetMediaEvent>) {
    Object.assign(this, partial);
  }

  public readonly cardPresetId: string;
  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'add-card-preset-media';
}

export class SoftRemoveMediaEvent {
  constructor(partial: Partial<SoftRemoveMediaEvent>) {
    Object.assign(this, partial);
  }

  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'soft-remove-media';
}

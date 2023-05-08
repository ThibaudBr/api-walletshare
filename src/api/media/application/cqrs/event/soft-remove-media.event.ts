export class SoftRemoveMediaEvent {
  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'soft-remove-media';

  constructor(partial: Partial<SoftRemoveMediaEvent>) {
    Object.assign(this, partial);
  }
}

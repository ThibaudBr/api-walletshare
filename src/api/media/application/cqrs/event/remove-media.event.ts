export class RemoveMediaEvent {
  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'remove-media';

  constructor(partial: Partial<RemoveMediaEvent>) {
    Object.assign(this, partial);
  }
}

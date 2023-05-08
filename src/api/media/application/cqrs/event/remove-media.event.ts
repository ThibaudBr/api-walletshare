export class RemoveMediaEvent {
  constructor(partial: Partial<RemoveMediaEvent>) {
    Object.assign(this, partial);
  }

  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'remove-media';
}

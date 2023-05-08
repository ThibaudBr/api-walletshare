export class RestoreMediaEvent {
  constructor(partial: Partial<RestoreMediaEvent>) {
    Object.assign(this, partial);
  }

  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'restore-media';
}

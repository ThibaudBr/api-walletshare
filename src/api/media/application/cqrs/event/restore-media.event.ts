export class RestoreMediaEvent {
  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'restore-media';

  constructor(partial: Partial<RestoreMediaEvent>) {
    Object.assign(this, partial);
  }
}

export class UploadMediaEvent {
  constructor(partial: Partial<UploadMediaEvent>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly url: string;
  public readonly key: string;
  public readonly module: string = 'media';
  public readonly method: string = 'upload-media';
}

export class UploadMediaCommand {
  public readonly dataBuffer: Buffer;
  public readonly filename: string;

  constructor(partial: Partial<UploadMediaCommand>) {
    Object.assign(this, partial);
  }
}

export class UploadMediaCommand {
  constructor(partial: Partial<UploadMediaCommand>) {
    Object.assign(this, partial);
  }

  public readonly dataBuffer: Buffer;
  public readonly filename: string;
}

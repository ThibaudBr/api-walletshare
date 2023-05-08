export class NewMediaDto {
  public readonly fileName: string;
  public readonly imageBuffer: Buffer;

  constructor(partial: Partial<NewMediaDto>) {
    Object.assign(this, partial);
  }
}

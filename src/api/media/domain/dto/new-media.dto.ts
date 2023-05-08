export class NewMediaDto {
  constructor(partial: Partial<NewMediaDto>) {
    Object.assign(this, partial);
  }

  public readonly fileName: string;
  public readonly imageBuffer: Buffer;
}

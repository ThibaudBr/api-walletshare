export class SoftRemoveMediaCommand {
  public readonly mediaId: string;

  constructor(partial: Partial<SoftRemoveMediaCommand>) {
    Object.assign(this, partial);
  }
}

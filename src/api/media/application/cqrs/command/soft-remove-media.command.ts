export class SoftRemoveMediaCommand {
  constructor(partial: Partial<SoftRemoveMediaCommand>) {
    Object.assign(this, partial);
  }

  public readonly mediaId: string;
}

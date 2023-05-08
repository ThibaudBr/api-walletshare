export class RemoveMediaCommand {
  public readonly mediaId: string;

  constructor(partial: Partial<RemoveMediaCommand>) {
    Object.assign(this, partial);
  }
}

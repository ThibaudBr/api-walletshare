export class RemoveMediaCommand {
  constructor(partial: Partial<RemoveMediaCommand>) {
    Object.assign(this, partial);
  }

  public readonly mediaId: string;
}

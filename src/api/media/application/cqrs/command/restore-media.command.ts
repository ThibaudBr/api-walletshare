export class RestoreMediaCommand {
  public readonly mediaId: string;

  constructor(partial: Partial<RestoreMediaCommand>) {
    Object.assign(this, partial);
  }
}

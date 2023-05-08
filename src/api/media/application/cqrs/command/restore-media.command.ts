export class RestoreMediaCommand {
  constructor(partial: Partial<RestoreMediaCommand>) {
    Object.assign(this, partial);
  }

  public readonly mediaId: string;
}

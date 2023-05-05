export class RestoreCardCommand {
  public readonly id: string;

  constructor(partial: Partial<RestoreCardCommand>) {
    Object.assign(this, partial);
  }
}

export class RestoreCardCommand {
  constructor(partial: Partial<RestoreCardCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}

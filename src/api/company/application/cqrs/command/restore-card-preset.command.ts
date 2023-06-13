export class RestoreCardPresetCommand {
  public readonly id: string;

  constructor(partial: Partial<RestoreCardPresetCommand>) {
    Object.assign(this, partial);
  }
}

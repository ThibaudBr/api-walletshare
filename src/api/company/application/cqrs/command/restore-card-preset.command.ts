export class RestoreCardPresetCommand {
  constructor(partial: Partial<RestoreCardPresetCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}

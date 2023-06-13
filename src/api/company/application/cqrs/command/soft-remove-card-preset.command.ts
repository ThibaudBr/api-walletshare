export class SoftRemoveCardPresetCommand {
  public readonly id: string;

  constructor(partial: Partial<SoftRemoveCardPresetCommand>) {
    Object.assign(this, partial);
  }
}

export class SoftRemoveCardPresetCommand {
  constructor(partial: Partial<SoftRemoveCardPresetCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}

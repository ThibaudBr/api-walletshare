export class RemoveCardPresetCommand {
  public readonly id: string;

  constructor(partial: Partial<RemoveCardPresetCommand>) {
    Object.assign(this, partial);
  }
}

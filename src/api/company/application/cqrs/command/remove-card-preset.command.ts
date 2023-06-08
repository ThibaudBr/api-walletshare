export class RemoveCardPresetCommand {
  constructor(partial: Partial<RemoveCardPresetCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}

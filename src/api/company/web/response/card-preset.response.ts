export class CardPresetResponse {
  constructor(partial: Partial<CardPresetResponse>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly alignment: string;
  public readonly backgroundColor: string;
}

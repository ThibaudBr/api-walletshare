export class CardPresetResponse {
  public readonly id: string;
  public readonly alignment: string;
  public readonly backgroundColor: string;

  constructor(partial: Partial<CardPresetResponse>) {
    Object.assign(this, partial);
  }
}

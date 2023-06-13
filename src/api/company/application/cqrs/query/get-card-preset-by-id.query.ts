export class GetCardPresetByIdQuery {
  public readonly id: string;

  constructor(partial: Partial<GetCardPresetByIdQuery>) {
    Object.assign(this, partial);
  }
}

export class GetCardPresetByIdQuery {
  constructor(partial: Partial<GetCardPresetByIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}

export class GetCardByIdQuery {
  public readonly id: string;

  constructor(partial: Partial<GetCardByIdQuery>) {
    Object.assign(this, partial);
  }
}

export class GetCardByIdQuery {
  constructor(partial: Partial<GetCardByIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}

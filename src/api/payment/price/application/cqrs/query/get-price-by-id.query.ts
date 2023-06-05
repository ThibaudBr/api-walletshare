export class GetPriceByIdQuery {
  public readonly id: string;
  public readonly withDeleted: boolean = false;

  constructor(partial: Partial<GetPriceByIdQuery>) {
    Object.assign(this, partial);
  }
}

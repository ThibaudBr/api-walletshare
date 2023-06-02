export class GetProductByIdQuery {
  constructor(partial: Partial<GetProductByIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}

export class GetProductByIdQuery {
  public readonly id: string;

  constructor(partial: Partial<GetProductByIdQuery>) {
    Object.assign(this, partial);
  }
}

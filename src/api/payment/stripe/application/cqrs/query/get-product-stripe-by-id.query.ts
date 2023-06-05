export class GetProductStripeByIdQuery {
  public readonly id: string;

  constructor(partial: Partial<GetProductStripeByIdQuery>) {
    Object.assign(this, partial);
  }
}

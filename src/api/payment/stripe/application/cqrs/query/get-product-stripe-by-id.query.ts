export class GetProductStripeByIdQuery {
  constructor(partial: Partial<GetProductStripeByIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}

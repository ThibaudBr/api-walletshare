export class GetUserByStripeCustomerIdQuery {
  public readonly stripeCustomerId: string;

  constructor(partial: Partial<GetUserByStripeCustomerIdQuery>) {
    Object.assign(this, partial);
  }
}

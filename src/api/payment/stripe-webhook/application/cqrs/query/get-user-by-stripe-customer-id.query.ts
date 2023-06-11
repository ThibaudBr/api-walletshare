export class GetUserByStripeCustomerIdQuery {
  constructor(partial: Partial<GetUserByStripeCustomerIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly stripeCustomerId: string;
}

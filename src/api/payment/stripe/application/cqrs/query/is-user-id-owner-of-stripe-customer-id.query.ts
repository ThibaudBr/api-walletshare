export class IsUserIdOwnerOfStripeCustomerIdQuery {
  constructor(partial: Partial<IsUserIdOwnerOfStripeCustomerIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public readonly stripeCustomerId: string;
}

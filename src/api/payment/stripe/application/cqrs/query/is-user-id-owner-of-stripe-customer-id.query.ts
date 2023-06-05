export class IsUserIdOwnerOfStripeCustomerIdQuery {
  public readonly userId: string;
  public readonly stripeCustomerId: string;

  constructor(partial: Partial<IsUserIdOwnerOfStripeCustomerIdQuery>) {
    Object.assign(this, partial);
  }
}

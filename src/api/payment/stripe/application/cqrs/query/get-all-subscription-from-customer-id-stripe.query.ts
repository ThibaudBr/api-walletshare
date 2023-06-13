export class GetAllSubscriptionFromCustomerIdStripeQuery {
  public readonly customerId: string;

  constructor(partial: Partial<GetAllSubscriptionFromCustomerIdStripeQuery>) {
    Object.assign(this, partial);
  }
}

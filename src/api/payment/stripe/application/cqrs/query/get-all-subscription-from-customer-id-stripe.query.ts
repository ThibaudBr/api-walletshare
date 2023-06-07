export class GetAllSubscriptionFromCustomerIdStripeQuery {
  constructor(partial: Partial<GetAllSubscriptionFromCustomerIdStripeQuery>) {
    Object.assign(this, partial);
  }

  public readonly customerId: string;
}

export class GetSubscriptionStripeQuery {
  public readonly subscriptionId: string;

  constructor(partial: Partial<GetSubscriptionStripeQuery>) {
    Object.assign(this, partial);
  }
}

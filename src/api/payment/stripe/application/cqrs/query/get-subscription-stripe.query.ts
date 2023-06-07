export class GetSubscriptionStripeQuery {
  constructor(partial: Partial<GetSubscriptionStripeQuery>) {
    Object.assign(this, partial);
  }

  public readonly subscriptionId: string;
}

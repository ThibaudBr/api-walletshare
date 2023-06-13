export class GetSubscriptionByStripeSubscriptionIdQuery {
  public readonly stripeSubscriptionId: string;

  constructor(partial: Partial<GetSubscriptionByStripeSubscriptionIdQuery>) {
    Object.assign(this, partial);
  }
}

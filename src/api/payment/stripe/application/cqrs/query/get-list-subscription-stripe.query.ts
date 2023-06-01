export class GetListSubscriptionStripeQuery {
  constructor(partial: Partial<GetListSubscriptionStripeQuery>) {
    Object.assign(this, partial);
  }

  public readonly stripeCustomerId: string;
  public readonly priceId: string;
}

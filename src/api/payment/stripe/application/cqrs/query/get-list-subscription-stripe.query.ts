export class GetListSubscriptionStripeQuery {
  public readonly stripeCustomerId: string;
  public readonly priceId: string;

  constructor(partial: Partial<GetListSubscriptionStripeQuery>) {
    Object.assign(this, partial);
  }
}

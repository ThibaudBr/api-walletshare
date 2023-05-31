export class ChargeStripeRequest {
  constructor(partial: Partial<ChargeStripeRequest>) {
    Object.assign(this, partial);
  }

  public readonly stripeCustomerId: string;
  public readonly amount: number;
  public readonly paymentMethodId: string;
}

export class ChargeStripeRequest {
  public readonly amount: number;
  public readonly paymentMethodId: string;

  constructor(partial: Partial<ChargeStripeRequest>) {
    Object.assign(this, partial);
  }
}

export class ChargeStripeCommand {
  public readonly stripeCustomerId: string;
  public readonly amount: number;
  public readonly paymentMethodId: string;

  constructor(partial: Partial<ChargeStripeCommand>) {
    Object.assign(this, partial);
  }
}

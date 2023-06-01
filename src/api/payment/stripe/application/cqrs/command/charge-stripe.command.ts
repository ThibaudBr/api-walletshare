export class ChargeStripeCommand {
  constructor(partial: Partial<ChargeStripeCommand>) {
    Object.assign(this, partial);
  }

  public readonly stripeCustomerId: string;
  public readonly amount: number;
  public readonly paymentMethodId: string;
}

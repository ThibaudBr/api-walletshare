export class ChargeStripeEvent {
  constructor(partial: Partial<ChargeStripeEvent>) {
    Object.assign(this, partial);
  }

  public readonly stripeCustomerId: string;
  public readonly amount: number;
  public readonly paymentMethodId: string;
  public readonly methode: string = 'charge-stripe';
  public readonly module: string = 'payment';
}

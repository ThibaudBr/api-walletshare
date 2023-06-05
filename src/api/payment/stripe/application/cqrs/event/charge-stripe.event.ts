export class ChargeStripeEvent {
  public readonly stripeCustomerId: string;
  public readonly amount: number;
  public readonly paymentMethodId: string;
  public readonly methode: string = 'charge-stripe';
  public readonly module: string = 'stripe';

  constructor(partial: Partial<ChargeStripeEvent>) {
    Object.assign(this, partial);
  }
}

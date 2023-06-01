export class SetDefaultCreditCardStripeEvent {
  constructor(partial: Partial<SetDefaultCreditCardStripeEvent>) {
    Object.assign(this, partial);
  }

  public readonly stripeCustomerId: string;
  public readonly paymentMethodId: string;
  public readonly methode: string = 'set-default-credit-card-stripe';
  public readonly module: string = 'payment';
}

export class SetDefaultCreditCardStripeCommand {
  public readonly stripeCustomerId: string;
  public readonly paymentMethodId: string;

  constructor(partial: Partial<SetDefaultCreditCardStripeCommand>) {
    Object.assign(this, partial);
  }
}

export class SetDefaultCreditCardStripeCommand {
  constructor(partial: Partial<SetDefaultCreditCardStripeCommand>) {
    Object.assign(this, partial);
  }

  public readonly stripeCustomerId: string;
  public readonly paymentMethodId: string;
}

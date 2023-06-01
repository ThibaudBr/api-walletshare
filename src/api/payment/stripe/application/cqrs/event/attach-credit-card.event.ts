export class AttachCreditCardEvent {
  constructor(partial: Partial<AttachCreditCardEvent>) {
    Object.assign(this, partial);
  }

  public readonly stripeCustomerId: string;
  public readonly paymentMethodId: string;
  public readonly methode: string = 'attach-credit-card';
  public readonly module: string = 'payment';
}

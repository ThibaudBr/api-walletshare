export class AttachCreditCardCommand {
  public readonly stripeCustomerId: string;
  public readonly paymentMethodId: string;

  constructor(partial: Partial<AttachCreditCardCommand>) {
    Object.assign(this, partial);
  }
}

export class AttachCreditCardCommand {
  constructor(partial: Partial<AttachCreditCardCommand>) {
    Object.assign(this, partial);
  }

  public readonly stripeCustomerId: string;
  public readonly paymentMethodId: string;
}

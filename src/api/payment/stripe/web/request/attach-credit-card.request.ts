export class AttachCreditCardRequest {
  public readonly paymentMethodId: string;

  constructor(partial: Partial<AttachCreditCardRequest>) {
    Object.assign(this, partial);
  }
}

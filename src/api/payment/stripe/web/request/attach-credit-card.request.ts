export class AttachCreditCardRequest {
  constructor(partial: Partial<AttachCreditCardRequest>) {
    Object.assign(this, partial);
  }

  public readonly paymentMethodId: string;
}

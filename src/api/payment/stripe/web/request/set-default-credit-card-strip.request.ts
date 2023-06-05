export class SetDefaultCreditCardStripRequest {
  public readonly paymentMethodId: string;

  constructor(partial: Partial<SetDefaultCreditCardStripRequest>) {
    Object.assign(this, partial);
  }
}

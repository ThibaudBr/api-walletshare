export class SetDefaultCreditCardStripRequest {
  constructor(partial: Partial<SetDefaultCreditCardStripRequest>) {
    Object.assign(this, partial);
  }

  public readonly paymentMethodId: string;
}

export class CreateSubscriptionRequest {
  public readonly customerId: string;
  public readonly priceId: string;
  public readonly paymentMethod: string;
  public readonly referralCode?: string;

  constructor(partial: Partial<CreateSubscriptionRequest>) {
    Object.assign(this, partial);
  }
}

export class CreateSubscriptionRequest {
  public readonly priceId: string;
  public readonly referralCode?: string;

  constructor(partial: Partial<CreateSubscriptionRequest>) {
    Object.assign(this, partial);
  }
}

export class CreateSubscriptionRequest {
  constructor(partial: Partial<CreateSubscriptionRequest>) {
    Object.assign(this, partial);
  }

  public readonly priceId: string;
  public readonly referralCode?: string;
}

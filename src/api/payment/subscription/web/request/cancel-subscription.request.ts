export class CancelSubscriptionRequest {
  constructor(partial: Partial<CancelSubscriptionRequest>) {
    Object.assign(this, partial);
  }

  public readonly subscriptionId: string;
}

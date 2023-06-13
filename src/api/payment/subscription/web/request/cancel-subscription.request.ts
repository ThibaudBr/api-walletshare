export class CancelSubscriptionRequest {
  public readonly subscriptionId: string;

  constructor(partial: Partial<CancelSubscriptionRequest>) {
    Object.assign(this, partial);
  }
}

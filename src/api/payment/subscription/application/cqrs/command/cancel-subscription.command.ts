export class CancelSubscriptionCommand {
  public readonly subscriptionId: string;

  constructor(partial: Partial<CancelSubscriptionCommand>) {
    Object.assign(this, partial);
  }
}

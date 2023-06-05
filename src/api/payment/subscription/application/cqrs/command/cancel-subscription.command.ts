export class CancelSubscriptionCommand {
  constructor(partial: Partial<CancelSubscriptionCommand>) {
    Object.assign(this, partial);
  }

  public readonly subscriptionId: string;
}

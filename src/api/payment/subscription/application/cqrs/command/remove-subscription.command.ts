export class RemoveSubscriptionCommand {
  public readonly subscriptionId: string;

  constructor(partial: Partial<RemoveSubscriptionCommand>) {
    Object.assign(this, partial);
  }
}

export class RemoveSubscriptionEvent {
  public readonly subscriptionId: string;
  public readonly method: string = 'remove-subscription';
  public readonly module: string = 'subscription';

  constructor(partial: Partial<RemoveSubscriptionEvent>) {
    Object.assign(this, partial);
  }
}

export class CancelSubscriptionEvent {
  constructor(partial: Partial<CancelSubscriptionEvent>) {
    Object.assign(this, partial);
  }

  public readonly subscriptionId: string;
  public readonly method: string = 'cancel-subscription';
  public readonly module: string = 'subscription';
}

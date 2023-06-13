export class UpdateSubscriptionEvent {
  constructor(partial: Partial<UpdateSubscriptionEvent>) {
    Object.assign(this, partial);
  }

  public readonly subscriptionId: string;
  public readonly method: string = 'udpate-subscription';
  public readonly module: string = 'subscription';
}

export class CreateSubscriptionEvent {
  constructor(partial: Partial<CreateSubscriptionEvent>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public readonly subscriptionId: string;
  public readonly method: string = 'create-subscription';
  public readonly module: string = 'subscription';
}

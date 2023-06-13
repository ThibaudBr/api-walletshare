export class CreateSubscriptionEvent {
  public readonly userId: string;
  public readonly subscriptionId: string;
  public readonly method: string = 'create-subscription';
  public readonly module: string = 'subscription';

  constructor(partial: Partial<CreateSubscriptionEvent>) {
    Object.assign(this, partial);
  }
}

export class AssignProfileToSubscriptionEvent {
  public readonly profileId: string;
  public readonly subscriptionId: string;
  public readonly method: string = 'assign-profile-to-subscription';
  public readonly module: string = 'subscription';

  constructor(partial: Partial<AssignProfileToSubscriptionEvent>) {
    Object.assign(this, partial);
  }
}

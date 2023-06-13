export class AssignProfileToSubscriptionEvent {
  constructor(partial: Partial<AssignProfileToSubscriptionEvent>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
  public readonly subscriptionId: string;
  public readonly method: string = 'assign-profile-to-subscription';
  public readonly module: string = 'subscription';
}

export class RemoveProfileToSubscriptionEvent {
  constructor(partial: Partial<RemoveProfileToSubscriptionEvent>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
  public readonly subscriptionId: string;
  public readonly method: string = 'remove-profile-to-subscription';
  public readonly module: string = 'subscription';
}

export class RemoveProfileToSubscriptionEvent {
  public readonly profileId: string;
  public readonly subscriptionId: string;
  public readonly method: string = 'remove-profile-to-subscription';
  public readonly module: string = 'subscription';

  constructor(partial: Partial<RemoveProfileToSubscriptionEvent>) {
    Object.assign(this, partial);
  }
}

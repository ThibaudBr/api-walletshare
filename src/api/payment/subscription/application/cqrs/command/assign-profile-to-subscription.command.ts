export class AssignProfileToSubscriptionCommand {
  public readonly profileId: string;
  public readonly subscriptionId: string;
  public readonly isSubscriptionOwner: boolean;

  constructor(partial: Partial<AssignProfileToSubscriptionCommand>) {
    Object.assign(this, partial);
  }
}

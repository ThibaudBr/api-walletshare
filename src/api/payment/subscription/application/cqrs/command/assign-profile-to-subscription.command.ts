export class AssignProfileToSubscriptionCommand {
  constructor(partial: Partial<AssignProfileToSubscriptionCommand>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
  public readonly subscriptionId: string;
  public readonly isSubscriptionOwner: boolean;
}

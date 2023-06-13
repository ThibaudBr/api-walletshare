export class RemoveProfileToSubscriptionCommand {
  constructor(partial: Partial<RemoveProfileToSubscriptionCommand>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
  public readonly subscriptionId: string;
}

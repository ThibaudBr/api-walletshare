export class RemoveProfileToSubscriptionCommand {
  public readonly profileId: string;
  public readonly subscriptionId: string;

  constructor(partial: Partial<RemoveProfileToSubscriptionCommand>) {
    Object.assign(this, partial);
  }
}

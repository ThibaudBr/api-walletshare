export class CreateUsedReferralCodeCommand {
  public readonly userId: string;
  public readonly referralCode: string;
  public readonly subscriptionId: string;

  constructor(partial: Partial<CreateUsedReferralCodeCommand>) {
    Object.assign(this, partial);
  }
}

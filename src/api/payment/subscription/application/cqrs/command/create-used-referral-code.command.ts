export class CreateUsedReferralCodeCommand {
  constructor(partial: Partial<CreateUsedReferralCodeCommand>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public readonly referralCode: string;
  public readonly subscriptionId: string;
}

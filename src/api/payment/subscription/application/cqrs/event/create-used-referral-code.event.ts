export class CreateUsedReferralCodeEvent {
  public readonly userId: string;
  public readonly referralCodeId: string;
  public readonly method: string = 'create-used-referral-code';
  public readonly module: string = 'subscription';

  constructor(partial: Partial<CreateUsedReferralCodeEvent>) {
    Object.assign(this, partial);
  }
}

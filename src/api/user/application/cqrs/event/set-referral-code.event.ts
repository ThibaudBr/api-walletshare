export class SetReferralCodeEvent {
  constructor(partial: Partial<SetReferralCodeEvent>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public readonly referralCodeId: string;
  public readonly method: string = 'set-referral-code';
  public readonly module: string = 'user';
}

export class SetReferralCodeEvent {
  public readonly userId: string;
  public readonly referralCodeId: string;
  public readonly method: string = 'set-referral-code';
  public readonly module: string = 'user';

  constructor(partial: Partial<SetReferralCodeEvent>) {
    Object.assign(this, partial);
  }
}

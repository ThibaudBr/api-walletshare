export class CreateReferralCodeStripeEvent {
  constructor(partial: Partial<CreateReferralCodeStripeEvent>) {
    Object.assign(this, partial);
  }

  public readonly referralCodeId: string;
  public readonly method: string = 'create-referral-code';
  public readonly module: string = 'stripe';
}

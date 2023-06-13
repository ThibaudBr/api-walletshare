import Stripe from 'stripe';

export class SetReferralCodeCommand {
  public readonly userId: string;
  public readonly referralCode: Stripe.PromotionCode;

  constructor(partial: Partial<SetReferralCodeCommand>) {
    Object.assign(this, partial);
  }
}

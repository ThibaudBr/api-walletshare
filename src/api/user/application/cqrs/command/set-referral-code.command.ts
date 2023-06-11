import Stripe from 'stripe';

export class SetReferralCodeCommand {
  constructor(partial: Partial<SetReferralCodeCommand>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public readonly referralCode: Stripe.PromotionCode;
}

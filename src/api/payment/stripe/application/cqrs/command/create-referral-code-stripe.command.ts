export class CreateReferralCodeStripeCommand {
  public readonly customerStripeId: string;
  public readonly couponStripeId: string;
  public readonly code?: string;
  public readonly userId: string;

  constructor(partial: Partial<CreateReferralCodeStripeCommand>) {
    Object.assign(this, partial);
  }
}

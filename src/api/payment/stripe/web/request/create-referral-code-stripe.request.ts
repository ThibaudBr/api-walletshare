export class CreateReferralCodeStripeRequest {
  public readonly couponStripeId: string;
  public readonly customerStripeId: string;
  public readonly userId: string;
  public readonly code?: string;

  constructor(partial: Partial<CreateReferralCodeStripeRequest>) {
    Object.assign(this, partial);
  }
}

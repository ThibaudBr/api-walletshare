export class CreateReferralCodeStripeRequest {
  constructor(partial: Partial<CreateReferralCodeStripeRequest>) {
    Object.assign(this, partial);
  }

  public readonly couponStripeId: string;
  public readonly customerStripeId: string;
  public readonly userId: string;
  public readonly code?: string;
}

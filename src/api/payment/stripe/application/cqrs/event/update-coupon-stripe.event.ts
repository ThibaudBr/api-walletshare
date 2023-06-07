export class UpdateCouponStripeEvent {
  constructor(partial: Partial<UpdateCouponStripeEvent>) {
    Object.assign(this, partial);
  }

  public readonly couponId: string;
  public readonly method: string = 'update-coupon';
  public readonly module: string = 'stripe';
}

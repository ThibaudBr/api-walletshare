export class CreateCouponStripeEvent {
  constructor(partial: Partial<CreateCouponStripeEvent>) {
    Object.assign(this, partial);
  }

  public readonly couponId: string;
  public readonly method: string = 'create-coupon';
  public readonly module: string = 'stripe';
}

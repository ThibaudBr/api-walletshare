export class CreateCouponStripeEvent {
  public readonly couponId: string;
  public readonly method: string = 'create-coupon';
  public readonly module: string = 'stripe';

  constructor(partial: Partial<CreateCouponStripeEvent>) {
    Object.assign(this, partial);
  }
}

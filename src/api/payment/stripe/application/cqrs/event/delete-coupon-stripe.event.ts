export class DeleteCouponStripeEvent {
  constructor(partial: Partial<DeleteCouponStripeEvent>) {
    Object.assign(this, partial);
  }

  public readonly couponId: string;
  public readonly method: string = 'delete-coupon';
  public readonly module: string = 'stripe';
}

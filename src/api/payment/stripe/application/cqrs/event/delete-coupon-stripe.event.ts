export class DeleteCouponStripeEvent {
  public readonly couponId: string;
  public readonly method: string = 'delete-coupon';
  public readonly module: string = 'stripe';

  constructor(partial: Partial<DeleteCouponStripeEvent>) {
    Object.assign(this, partial);
  }
}

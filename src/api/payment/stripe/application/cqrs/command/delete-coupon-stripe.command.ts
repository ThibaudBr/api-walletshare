export class DeleteCouponStripeCommand {
  public readonly couponId: string;

  constructor(partial: Partial<DeleteCouponStripeCommand>) {
    Object.assign(this, partial);
  }
}

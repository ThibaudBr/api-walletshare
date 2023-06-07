export class DeleteCouponStripeCommand {
  constructor(partial: Partial<DeleteCouponStripeCommand>) {
    Object.assign(this, partial);
  }

  public readonly couponId: string;
}

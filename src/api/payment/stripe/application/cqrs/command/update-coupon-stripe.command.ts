export class UpdateCouponStripeCommand {
  constructor(partial: Partial<UpdateCouponStripeCommand>) {
    Object.assign(this, partial);
  }

  public readonly couponId: string;
  public readonly percentOff: string;
  public readonly duration: string = 'once';
}

export class UpdateCouponStripeCommand {
  public readonly couponId: string;
  public readonly percentOff: string;
  public readonly duration: string = 'once';

  constructor(partial: Partial<UpdateCouponStripeCommand>) {
    Object.assign(this, partial);
  }
}

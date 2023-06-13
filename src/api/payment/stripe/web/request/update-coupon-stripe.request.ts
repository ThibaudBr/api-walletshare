export class UpdateCouponStripeRequest {
  public readonly percentOff: string;
  public readonly duration: string = 'once';

  constructor(partial: Partial<UpdateCouponStripeRequest>) {
    Object.assign(this, partial);
  }
}

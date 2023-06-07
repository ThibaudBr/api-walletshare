export class UpdateCouponStripeRequest {
  constructor(partial: Partial<UpdateCouponStripeRequest>) {
    Object.assign(this, partial);
  }

  public readonly percentOff: string;
  public readonly duration: string = 'once';
}

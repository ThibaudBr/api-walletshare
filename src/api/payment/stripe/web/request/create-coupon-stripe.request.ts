export class CreateCouponStripeRequest {
  constructor(partial: Partial<CreateCouponStripeRequest>) {
    Object.assign(this, partial);
  }

  public readonly percentOff: number;
  public readonly duration: string = 'once';
}

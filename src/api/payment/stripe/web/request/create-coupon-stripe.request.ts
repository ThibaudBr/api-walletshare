export class CreateCouponStripeRequest {
  public readonly productStripeIdList: string[];
  public readonly percentOff: number;
  public readonly duration: string = 'once';

  constructor(partial: Partial<CreateCouponStripeRequest>) {
    Object.assign(this, partial);
  }
}

export class CreateCouponStripeCommand {
  constructor(partial: Partial<CreateCouponStripeCommand>) {
    Object.assign(this, partial);
  }

  public readonly percentOff: number;
  public readonly duration: string = 'once';
  public readonly productStripeIdList: string[];
}

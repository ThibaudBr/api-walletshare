export class CreateCouponStripeCommand {
  public readonly percentOff: number;
  public readonly duration: string = 'once';
  public readonly productStripeIdList: string[];

  constructor(partial: Partial<CreateCouponStripeCommand>) {
    Object.assign(this, partial);
  }
}

export class GetCouponByIdStripeQuery {
  public readonly couponId: string;

  constructor(partial: Partial<GetCouponByIdStripeQuery>) {
    Object.assign(this, partial);
  }
}

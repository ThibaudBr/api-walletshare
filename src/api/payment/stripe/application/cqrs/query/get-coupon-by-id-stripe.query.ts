export class GetCouponByIdStripeQuery {
  constructor(partial: Partial<GetCouponByIdStripeQuery>) {
    Object.assign(this, partial);
  }

  public readonly couponId: string;
}

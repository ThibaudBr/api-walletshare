export class UpdateProductStripRequest {
  constructor(partial: Partial<UpdateProductStripRequest>) {
    Object.assign(this, partial);
  }

  public readonly productStripeId: string;
  public readonly name?: string;
  public readonly description?: string;
  public readonly defaultPriceId?: string;
  public readonly active?: boolean;
}

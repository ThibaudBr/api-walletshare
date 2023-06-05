export class UpdateProductStripRequest {
  public readonly productStripeId: string;
  public readonly name?: string;
  public readonly description?: string;
  public readonly defaultPriceId?: string;
  public readonly active?: boolean;

  constructor(partial: Partial<UpdateProductStripRequest>) {
    Object.assign(this, partial);
  }
}

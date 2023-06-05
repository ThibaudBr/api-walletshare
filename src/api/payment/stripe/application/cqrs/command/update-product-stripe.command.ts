export class UpdateProductStripeCommand {
  public readonly productStripeId: string;
  public readonly name?: string;
  public readonly description?: string;
  public readonly active?: boolean;
  public readonly defaultPriceId?: string;

  constructor(partial: Partial<UpdateProductStripeCommand>) {
    Object.assign(this, partial);
  }
}

export class UpdateProductStripeCommand {
  constructor(partial: Partial<UpdateProductStripeCommand>) {
    Object.assign(this, partial);
  }

  public readonly productStripeId: string;
  public readonly name?: string;
  public readonly description?: string;
  public readonly active?: boolean;
  public readonly defaultPriceId?: string;
}

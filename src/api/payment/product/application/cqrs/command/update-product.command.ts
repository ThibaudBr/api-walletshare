export class UpdateProductCommand {
  public readonly id: string;
  public readonly name?: string;
  public readonly description?: string;
  public readonly stripeProductId?: string;
  public readonly jsonStripeMetadata?: object;
  public readonly active?: boolean;

  constructor(partial: Partial<UpdateProductCommand>) {
    Object.assign(this, partial);
  }
}

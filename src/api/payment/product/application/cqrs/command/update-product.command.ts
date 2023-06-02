export class UpdateProductCommand {
  constructor(partial: Partial<UpdateProductCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly name?: string;
  public readonly description?: string;
  public readonly stripeProductId?: string;
  public readonly jsonStripeMetadata?: object;
  public readonly active?: boolean;
}

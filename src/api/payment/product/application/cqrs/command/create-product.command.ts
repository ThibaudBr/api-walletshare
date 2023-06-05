export class CreateProductCommand {
  public readonly name: string;
  public readonly description: string;
  public readonly stripeProductId: string;
  public readonly jsonStripeMetadata: object;

  constructor(partial: Partial<CreateProductCommand>) {
    Object.assign(this, partial);
  }
}

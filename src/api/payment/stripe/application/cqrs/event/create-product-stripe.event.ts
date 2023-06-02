export class CreateProductStripeEvent {
  constructor(partial: Partial<CreateProductStripeEvent>) {
    Object.assign(this, partial);
  }

  public readonly stripeProductId: string;
  public readonly method: string = 'create-product-stripe';
  public readonly module: string = 'payment';
}

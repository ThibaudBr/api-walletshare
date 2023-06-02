export class UpdateProductStripeEvent {
  constructor(partial: Partial<UpdateProductStripeEvent>) {
    Object.assign(this, partial);
  }

  public readonly stripeProductId: string;
  public readonly method: string = 'update-product-stripe';
  public readonly module: string = 'payment';
}

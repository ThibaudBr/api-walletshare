export class UpdateProductStripeEvent {
  public readonly stripeProductId: string;
  public readonly method: string = 'update-product-stripe';
  public readonly module: string = 'stripe';

  constructor(partial: Partial<UpdateProductStripeEvent>) {
    Object.assign(this, partial);
  }
}

export class CreateProductStripeEvent {
  public readonly stripeProductId: string;
  public readonly method: string = 'create-product-stripe';
  public readonly module: string = 'stripe';

  constructor(partial: Partial<CreateProductStripeEvent>) {
    Object.assign(this, partial);
  }
}
export class RemoveProductStripeEvent {
  public readonly stripeProductId: string;
  public readonly method: string = 'remove-product-stripe';
  public readonly module: string = 'stripe';

  constructor(partial: Partial<RemoveProductStripeEvent>) {
    Object.assign(this, partial);
  }
}

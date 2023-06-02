export class RemoveProductStripeEvent {
  constructor(partial: Partial<RemoveProductStripeEvent>) {
    Object.assign(this, partial);
  }

  public readonly stripeProductId: string;
  public readonly method: string = 'remove-product-stripe';
  public readonly module: string = 'payment';
}

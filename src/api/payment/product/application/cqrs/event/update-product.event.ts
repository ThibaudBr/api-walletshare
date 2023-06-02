export class UpdateProductEvent {
  constructor(partial: Partial<UpdateProductEvent>) {
    Object.assign(this, partial);
  }

  public readonly productId: string;
  public readonly stripeProductId: string;
  public readonly method: string = 'update-product';
  public readonly module: string = 'payment';
}

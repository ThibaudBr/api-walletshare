export class CreateProductEvent {
  public readonly productId: string;
  public readonly stripeProductId: string;
  public readonly method: string = 'create-product';
  public readonly module: string = 'payment';

  constructor(partial: Partial<CreateProductEvent>) {
    Object.assign(this, partial);
  }
}

export class UpdateProductRequest {
  public readonly id: string;
  public readonly name?: string;
  public readonly description?: string;
  public readonly stripeProductId?: string;
  public readonly active?: boolean;

  constructor(partial: Partial<UpdateProductRequest>) {
    Object.assign(this, partial);
  }
}

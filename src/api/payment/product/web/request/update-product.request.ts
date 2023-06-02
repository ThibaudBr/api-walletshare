export class UpdateProductRequest {
  constructor(partial: Partial<UpdateProductRequest>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly name?: string;
  public readonly description?: string;
  public readonly stripeProductId?: string;
  public readonly active?: boolean;
}

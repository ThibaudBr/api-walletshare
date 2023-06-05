export class CreateProductRequest {
  public readonly name: string;
  public readonly description: string;

  constructor(partial: Partial<CreateProductRequest>) {
    Object.assign(this, partial);
  }
}

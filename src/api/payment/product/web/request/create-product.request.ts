export class CreateProductRequest {
  constructor(partial: Partial<CreateProductRequest>) {
    Object.assign(this, partial);
  }

  public readonly name: string;
  public readonly description: string;
}

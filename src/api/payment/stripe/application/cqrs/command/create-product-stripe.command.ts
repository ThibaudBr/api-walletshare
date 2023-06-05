export class CreateProductStripeCommand {
  public readonly name: string;
  public readonly description: string;

  constructor(partial: Partial<CreateProductStripeCommand>) {
    Object.assign(this, partial);
  }
}

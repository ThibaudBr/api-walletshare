export class CreateProductStripeCommand {
  constructor(partial: Partial<CreateProductStripeCommand>) {
    Object.assign(this, partial);
  }

  public readonly name: string;
  public readonly description: string;
}

export class RemoveProductStripeCommand {
  public readonly id: string;

  constructor(partial: Partial<RemoveProductStripeCommand>) {
    Object.assign(this, partial);
  }
}

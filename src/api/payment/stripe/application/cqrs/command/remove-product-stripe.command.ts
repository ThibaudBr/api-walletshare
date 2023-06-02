export class RemoveProductStripeCommand {
  constructor(partial: Partial<RemoveProductStripeCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}

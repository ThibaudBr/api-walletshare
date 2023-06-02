export class RemoveProductEvent {
  constructor(partial: Partial<RemoveProductEvent>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly method: string = 'remove-product';
  public readonly module: string = 'payment';
}

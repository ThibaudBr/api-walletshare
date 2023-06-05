export class RemoveProductEvent {
  public readonly id: string;
  public readonly method: string = 'remove-product';
  public readonly module: string = 'payment';

  constructor(partial: Partial<RemoveProductEvent>) {
    Object.assign(this, partial);
  }
}

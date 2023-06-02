export class SoftRemoveProductEvent {
  constructor(partial: Partial<SoftRemoveProductEvent>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly method: string = 'soft-remove-product';
  public readonly module: string = 'payment';
}

export class SoftRemoveProductEvent {
  public readonly id: string;
  public readonly method: string = 'soft-remove-product';
  public readonly module: string = 'payment';

  constructor(partial: Partial<SoftRemoveProductEvent>) {
    Object.assign(this, partial);
  }
}

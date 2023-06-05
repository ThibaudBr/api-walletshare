export class RestoreProductEvent {
  public readonly id: string;
  public readonly method: string = 'restore-product';
  public readonly module: string = 'product';

  constructor(partial: Partial<RestoreProductEvent>) {
    Object.assign(this, partial);
  }
}

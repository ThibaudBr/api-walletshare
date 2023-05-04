export class SoftRemoveAddressEvent {
  public readonly addressId: string;
  public readonly module: string = 'address';
  public readonly method: string = 'soft-remove-address';

  constructor(partial: Partial<SoftRemoveAddressEvent>) {
    Object.assign(this, partial);
  }
}

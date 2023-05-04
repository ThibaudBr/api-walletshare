export class RemoveAddressEvent {
  public readonly addressId: string;
  public readonly module: string = 'address';
  public readonly method: string = 'remove-address';

  constructor(partial: Partial<RemoveAddressEvent>) {
    Object.assign(this, partial);
  }
}

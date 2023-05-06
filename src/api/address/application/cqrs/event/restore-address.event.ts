export class RestoreAddressEvent {
  public readonly addressId: string;
  public readonly module: string = 'address';
  public readonly method: string = 'restore-address';

  constructor(partial: Partial<RestoreAddressEvent>) {
    Object.assign(this, partial);
  }
}

export class UpdateAddressEvent {
  public readonly addressId: string;
  public readonly module: string = 'address';
  public readonly method: string = 'update-address';

  constructor(partial: Partial<UpdateAddressEvent>) {
    Object.assign(this, partial);
  }
}

export class CreateAddressEvent {
  public readonly addressId: string;
  public readonly module: string = 'address';
  public readonly method: string = 'create-address';

  constructor(partial: Partial<CreateAddressEvent>) {
    Object.assign(this, partial);
  }
}

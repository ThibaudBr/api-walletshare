export class RestoreAddressCommand {
  public readonly addressId: string;

  constructor(partial: Partial<RestoreAddressCommand>) {
    Object.assign(this, partial);
  }
}

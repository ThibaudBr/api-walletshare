export class RemoveAddressCommand {
  public readonly addressId: string;

  constructor(partial: Partial<RemoveAddressCommand>) {
    Object.assign(this, partial);
  }
}

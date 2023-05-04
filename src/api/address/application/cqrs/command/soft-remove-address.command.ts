export class SoftRemoveAddressCommand {
  public readonly addressId: string;

  constructor(partial: Partial<SoftRemoveAddressCommand>) {
    Object.assign(this, partial);
  }
}

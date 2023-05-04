export class IsAbleToUpdateAddressQuery {
  public readonly userId: string;
  public readonly addressId: string;

  constructor(partial: Partial<IsAbleToUpdateAddressQuery>) {
    Object.assign(this, partial);
  }
}

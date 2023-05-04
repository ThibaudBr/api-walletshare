export class GetAddressByIdQuery {
  public readonly addressId: string;

  constructor(partial: Partial<GetAddressByIdQuery>) {
    Object.assign(this, partial);
  }
}

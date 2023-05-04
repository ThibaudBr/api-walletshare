export class AddressResponse {
  public readonly id: string;
  public readonly street: string;
  public readonly city: string;
  public readonly state: string;
  public readonly country: string;
  public readonly zipCode: string;
  public readonly latitude: string;
  public readonly longitude: string;

  constructor(partial: Partial<AddressResponse>) {
    Object.assign(this, partial);
  }
}

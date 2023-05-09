import { AddressDto } from '../../../domain/dto/address.dto';

export class UpdateAddressCommand {
  public readonly addressId: string;
  public readonly addressDto: AddressDto;

  constructor(partial: Partial<UpdateAddressCommand>) {
    Object.assign(this, partial);
  }
}

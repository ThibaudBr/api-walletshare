import { AddressDto } from '../../../domain/dto/address.dto';

export class CreateAddressCommand {
  public readonly userId?: string;
  public readonly companyId?: string;
  public readonly addressDto: AddressDto;

  constructor(partial: Partial<CreateAddressCommand>) {
    Object.assign(this, partial);
  }
}

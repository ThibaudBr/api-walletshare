import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAddressCommand } from '../../command/update-address.command';
import { AddressEntity } from '../../../../domain/entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { UpdateAddressEvent } from '../../event/update-address.event';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(UpdateAddressCommand)
export class UpdateAddressCommandHandler implements ICommandHandler<UpdateAddressCommand> {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateAddressCommand): Promise<void> {
    const addressToUpdate: AddressEntity = await this.addressRepository
      .findOneOrFail({
        where: {
          id: command.addressId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'UpdateAddressCommandHandler',
            localisation: 'addressRepository.findOneOrFail',
          }),
        );
        throw new Error('Address not found');
      });

    const updatedAddress: AddressEntity = new AddressEntity({
      ...addressToUpdate,
      ...command.addressDto,
    });

    const errors: ValidationError[] = await validate(updatedAddress);
    if (errors.length > 0) {
      throw errors;
    }

    await this.addressRepository.save(updatedAddress);
    await this.eventBus.publish(
      new UpdateAddressEvent({
        addressId: command.addressId,
      }),
    );
  }
}

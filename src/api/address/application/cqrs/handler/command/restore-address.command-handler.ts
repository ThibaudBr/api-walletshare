import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RestoreAddressCommand } from '../../command/restore-address.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from '../../../../domain/entities/address.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RestoreAddressCommand)
export class RestoreAddressCommandHandler implements ICommandHandler<RestoreAddressCommand> {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RestoreAddressCommand): Promise<void> {
    const addressToRestore: AddressEntity = await this.addressRepository
      .findOneOrFail({
        where: {
          id: command.addressId,
        },
        withDeleted: true,
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'RestoreAddressCommandHandler',
            localisation: 'addressRepository.findOneOrFail',
          }),
        );
        throw new Error('Address not found');
      });
    await this.addressRepository.restore(addressToRestore.id);
    await this.eventBus.publish(
      new RestoreAddressCommand({
        addressId: command.addressId,
      }),
    );
  }
}

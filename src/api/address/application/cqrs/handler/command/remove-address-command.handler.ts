import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveAddressCommand } from '../../command/remove-address.command';
import { AddressEntity } from '../../../../domain/entities/address.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RemoveAddressCommand)
export class RemoveAddressCommandHandler implements ICommandHandler<RemoveAddressCommand> {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveAddressCommand): Promise<void> {
    const addressToRemove: AddressEntity = await this.addressRepository
      .findOneOrFail({
        withDeleted: true,
        where: {
          id: command.addressId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'RemoveAddressCommandHandler',
            localisation: 'addressRepository.findOneOrFail',
          }),
        );
        throw new Error('Address not found');
      });
    await this.addressRepository.remove(addressToRemove);
    await this.eventBus.publish(
      new RemoveAddressCommand({
        addressId: command.addressId,
      }),
    );
  }
}

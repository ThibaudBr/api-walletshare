import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SoftRemoveAddressCommand } from '../../command/soft-remove-address.command';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from '../../../../domain/entities/address.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(SoftRemoveAddressCommand)
export class SoftRemoveAddressCommandHandler implements ICommandHandler<SoftRemoveAddressCommand> {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SoftRemoveAddressCommand): Promise<void> {
    const addressToRemove = await this.addressRepository
      .findOneOrFail({
        where: {
          id: command.addressId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'SoftRemoveAddressCommandHandler',
            localisation: 'addressRepository.findOneOrFail',
          }),
        );
        throw new Error('Address not found');
      });

    await this.addressRepository.softRemove(addressToRemove);
    await this.eventBus.publish(
      new SoftRemoveAddressCommand({
        addressId: command.addressId,
      }),
    );
  }
}

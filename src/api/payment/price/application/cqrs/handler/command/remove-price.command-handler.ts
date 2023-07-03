import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemovePriceCommand } from '../../command/remove-price.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { PriceEntity } from '../../../../domain/entities/price.entity';
import { Repository } from 'typeorm';

@CommandHandler(RemovePriceCommand)
export class RemovePriceCommandHandler implements ICommandHandler<RemovePriceCommand> {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemovePriceCommand): Promise<void> {
    const priceEntity: PriceEntity = await this.priceRepository
      .findOneOrFail({
        where: {
          id: command.priceId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'RemovePriceCommandHandler',
            localisation: 'priceRepository.findOneOrFail',
          }),
        );
        throw new Error('Error during find price entity');
      });

    await this.priceRepository.softRemove(priceEntity).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error.message,
          handler: 'RemovePriceCommandHandler',
          localisation: 'priceRepository.softRemove',
        }),
      );
      throw new Error('Error during soft remove price entity');
    });
  }
}

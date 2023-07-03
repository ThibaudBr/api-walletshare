import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SoftRemovePriceCommand } from '../../command/soft-remove-price.command';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceEntity } from '../../../../domain/entities/price.entity';
import { Repository } from 'typeorm';

@CommandHandler(SoftRemovePriceCommand)
export class SoftRemovePriceCommandHandler implements ICommandHandler<SoftRemovePriceCommand> {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SoftRemovePriceCommand): Promise<void> {
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
            handler: 'SoftRemovePriceCommandHandler',
            localisation: 'priceRepository.findOneOrFail',
          }),
        );
        throw new Error('Error during find price entity');
      });

    await this.priceRepository.softRemove(priceEntity).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error.message,
          handler: 'SoftRemovePriceCommandHandler',
          localisation: 'priceRepository.softRemove',
        }),
      );
      throw new Error('Error during soft remove price entity');
    });
  }
}

import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PriceEntity } from '../../../../domain/entities/price.entity';
import { RestorePriceCommand } from '../../command/restore-price.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RestorePriceCommand)
export class RestorePriceCommandHandler implements ICommandHandler<RestorePriceCommand> {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RestorePriceCommand): Promise<void> {
    const priceEntity: PriceEntity = await this.priceRepository
      .findOneOrFail({
        withDeleted: true,
        where: {
          id: command.priceId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error,
            handler: 'restorePriceCommandHandler',
            localisation: 'priceRepository.findOneOrFail',
          }),
        );
        throw new Error('Error during find price entity');
      });

    await this.priceRepository.restore(priceEntity.id).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error,
          handler: 'restorePriceCommandHandler',
          localisation: 'priceRepository.restore',
        }),
      );
      throw new Error('Error during restore price entity');
    });
  }
}

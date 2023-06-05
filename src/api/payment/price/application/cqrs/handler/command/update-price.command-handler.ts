import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePriceCommand } from '../../command/update-price.command';
import { UpdatePriceEvent } from '../../event/update-price.event';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceEntity } from '../../../../domain/entities/price.entity';
import { Repository } from 'typeorm';

@CommandHandler(UpdatePriceCommand)
export class UpdatePriceCommandHandler implements ICommandHandler<UpdatePriceCommand> {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdatePriceCommand): Promise<void> {
    const priceEntity: PriceEntity = await this.priceRepository
      .findOneOrFail({
        where: {
          id: command.priceId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error,
            handler: 'UpdatePriceCommandHandler',
            localisation: 'priceRepository.findOneOrFail',
          }),
        );
        throw new Error('Error during find price entity');
      });

    const priceEntityUpdated: PriceEntity = new PriceEntity({
      id: priceEntity.id,
      unitAmount: command.unitAmount,
      jsonStripeMetadata: command.jsonStripeMetadata,
      active: command.active,
      intervalCount: command.intervalCount,
      interval: command.interval,
      stripePriceId: command.stripePriceId,
      type: command.type,
      unitAmountDecimal: command.unitAmountDecimal,
    });
    await this.priceRepository
      .save({
        ...priceEntity,
        ...command,
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error,
            handler: 'UpdatePriceCommandHandler',
            localisation: 'priceRepository.save',
          }),
        );
      });

    await this.eventBus.publish(
      new UpdatePriceEvent({
        priceId: priceEntityUpdated.id,
      }),
    );
  }
}

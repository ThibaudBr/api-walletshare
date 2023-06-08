import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SoftRemoveCardPresetCommand } from '../../command/soft-remove-card-preset.command';
import { InjectRepository } from '@nestjs/typeorm';
import { CardPresetEntity } from '../../../../domain/entities/card-preset.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { SoftRemoveCardPresetEvent } from '../../event/soft-remove-card-preset.event';

@CommandHandler(SoftRemoveCardPresetCommand)
export class SoftRemoveCardPresetCommandHandler implements ICommandHandler<SoftRemoveCardPresetCommand> {
  constructor(
    @InjectRepository(CardPresetEntity)
    private readonly cardPresetRepository: Repository<CardPresetEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SoftRemoveCardPresetCommand): Promise<void> {
    const cardPreset: CardPresetEntity = await this.cardPresetRepository
      .findOneOrFail({
        where: {
          id: command.id,
        },
        withDeleted: true,
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'SoftRemoveCardPresetCommandHandler',
            localisation: 'cardPresetRepository.findOneOrFail',
          }),
        );
        throw new Error('Card preset not found');
      });

    await this.cardPresetRepository.softRemove(cardPreset).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error.message,
          handler: 'SoftRemoveCardPresetCommandHandler',
          localisation: 'cardPresetRepository.softRemove',
        }),
      );
      throw new Error('Card preset could not be soft removed');
    });

    await this.eventBus.publish(
      new SoftRemoveCardPresetEvent({
        id: cardPreset.id,
      }),
    );
  }
}

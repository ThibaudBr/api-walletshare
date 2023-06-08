import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveCardPresetCommand } from '../../command/remove-card-preset.command';
import { CardPresetEntity } from '../../../../domain/entities/card-preset.entity';
import { RemoveCardPresetEvent } from '../../event/remove-card-preset.event';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@CommandHandler(RemoveCardPresetCommand)
export class RemoveCardPresetCommandHandler implements ICommandHandler<RemoveCardPresetCommand> {
  constructor(
    @InjectRepository(CardPresetEntity)
    private readonly cardPresetRepository: Repository<CardPresetEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveCardPresetCommand): Promise<void> {
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
            handler: 'RemoveCardPresetCommandHandler',
            localisation: 'cardPresetRepository.findOneOrFail',
          }),
        );
        throw new Error('Card preset not found');
      });

    await this.cardPresetRepository.remove(cardPreset).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error.message,
          handler: 'RemoveCardPresetCommandHandler',
          localisation: 'cardPresetRepository.softRemove',
        }),
      );
      throw new Error('Card preset could not be removed');
    });

    await this.eventBus.publish(
      new RemoveCardPresetEvent({
        id: cardPreset.id,
      }),
    );
  }
}

import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCardPresetCommand } from '../../command/update-card-preset.command';
import { CardPresetEntity } from '../../../../domain/entities/card-preset.entity';
import { UpdateCardPresetEvent } from '../../event/update-card-preset.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(UpdateCardPresetCommand)
export class UpdateCardPresetCommandHandler implements ICommandHandler<UpdateCardPresetCommand> {
  constructor(
    @InjectRepository(CardPresetEntity)
    private readonly cardPresetRepository: Repository<CardPresetEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateCardPresetCommand): Promise<void> {
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
            handler: 'UpdateCardPresetCommandHandler',
            localisation: 'cardPresetRepository.findOneOrFail',
          }),
        );
        throw new Error('Card preset not found');
      });

    cardPreset.alignment = command.alignment;
    cardPreset.backgroundColor = command.backgroundColor;

    await this.cardPresetRepository.save(cardPreset).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error.message,
          handler: 'UpdateCardPresetCommandHandler',
          localisation: 'cardPresetRepository.save',
        }),
      );
      throw new Error('Card preset could not be updated');
    });

    await this.eventBus.publish(
      new UpdateCardPresetEvent({
        id: cardPreset.id,
      }),
    );
  }
}

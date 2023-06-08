import { CommandHandler, EventBus, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { RestoreCardPresetCommand } from '../../command/restore-card-preset.command';
import { RestoreCardPresetEvent } from '../../event/restore-card-preset.event';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { CardPresetEntity } from '../../../../domain/entities/card-preset.entity';
import { Repository } from 'typeorm';

@CommandHandler(RestoreCardPresetCommand)
export class RestoreCardPresetCommandHandler implements ICommandHandler<RestoreCardPresetCommand> {
  constructor(
    @InjectRepository(CardPresetEntity)
    private readonly cardPresetRepository: Repository<CardPresetEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RestoreCardPresetCommand): Promise<void> {
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
            handler: 'RestoreCardPresetCommandHandler',
            localisation: 'cardPresetRepository.findOneOrFail',
          }),
        );
        throw new Error('Card preset not found');
      });

    await this.cardPresetRepository.restore(cardPreset.id).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error.message,
          handler: 'RestoreCardPresetCommandHandler',
          localisation: 'cardPresetRepository.restore',
        }),
      );
      throw new Error('Card preset could not be restored');
    });

    await this.eventBus.publish(
      new RestoreCardPresetEvent({
        id: cardPreset.id,
      }),
    );
  }
}

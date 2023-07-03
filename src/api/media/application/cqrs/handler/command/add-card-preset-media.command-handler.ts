import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddCardPresetMediaCommand } from '../../command/add-card-preset-media.command';
import { CardPresetEntity } from '../../../../../company/domain/entities/card-preset.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddCardPresetMediaEvent } from '../../event/add-card-preset-media.event';

@CommandHandler(AddCardPresetMediaCommand)
export class AddCardPresetMediaCommandHandler implements ICommandHandler<AddCardPresetMediaCommand> {
  constructor(
    @InjectRepository(CardPresetEntity)
    private readonly cardPresetRepository: Repository<CardPresetEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddCardPresetMediaCommand): Promise<void> {
    const cardPresetEntity: CardPresetEntity = await this.cardPresetRepository
      .findOneOrFail({
        where: {
          id: command.cardPresetId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'AddCardPresetMediaCommandHandler',
            localisation: 'cardPresetRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw new Error('Card preset not found');
      });

    cardPresetEntity.media = command.mediaEntity;

    await this.cardPresetRepository.save(cardPresetEntity).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddCardPresetMediaCommandHandler',
          localisation: 'cardPresetRepository.save',
          error: error.message,
        }),
      );
      throw new Error('Card preset media not saved');
    });

    await this.eventBus.publish(
      new AddCardPresetMediaEvent({
        cardPresetId: command.cardPresetId,
        mediaId: command.mediaEntity.id,
      }),
    );
  }
}

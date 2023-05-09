import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddCardMediaCommand } from '../../command/add-card-media.command';
import { AddCardMediaEvent } from '../../event/add-card-media.event';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../../../card/domain/entities/card.entity';
import { Repository } from 'typeorm';
import { MediaEntity } from '../../../../domain/entities/media.entity';
import { SoftRemoveMediaCommand } from '../../command/soft-remove-media.command';

@CommandHandler(AddCardMediaCommand)
export class AddCardMediaCommandHandler implements ICommandHandler<AddCardMediaCommand> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: AddCardMediaCommand): Promise<void> {
    const card: CardEntity = await this.cardRepository
      .findOneOrFail({
        loadEagerRelations: false,
        relations: ['media'],
        where: {
          id: command.cardId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'AddCardMediaCommandHandler',
            localisation: 'cardRepository.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('Card not found');
      });

    if (card.media) {
      await this.commandBus.execute(
        new SoftRemoveMediaCommand({
          mediaId: card.media.id,
        }),
      );
    }

    card.media = command.mediaEntity;
    await this.cardRepository.save(card).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddCardMediaCommandHandler',
          localisation: 'CardRepository.save',
          error: error,
        }),
      );
      throw new Error('Card not saved');
    });
    await this.eventBus.publish(
      new AddCardMediaEvent({
        cardId: card.id,
        mediaId: command.mediaEntity.id,
      }),
    );
  }
}

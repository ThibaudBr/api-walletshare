import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RestoreCardCommand } from '../../command/restore-card.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { RestoreCardEvent } from '../../event/restore-card.event';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { ErrorInvalidIdRuntimeException } from '../../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';

@CommandHandler(RestoreCardCommand)
export class RestoreCardCommandHandler implements ICommandHandler<RestoreCardCommand> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RestoreCardCommand): Promise<void> {
    const cardToRestore = await this.cardRepository
      .findOneOrFail({
        withDeleted: true,
        where: [{ id: command.id }],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'RestoreCardCommandHandler',
            localisation: 'cardRepository.findOneOrFail',
          }),
        );
        throw new ErrorInvalidIdRuntimeException('Card not found');
      });

    if (cardToRestore.deletedAt == undefined) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'RestoreCardCommandHandler',
          localisation: 'cardRepository.findOneOrFail',
          error: 'Card not soft-deleted',
        }),
      );
      throw new Error('Card not soft-deleted');
    }
    await this.cardRepository.restore(command.id).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error.message,
          handler: 'RestoreCardCommandHandler',
          localisation: 'cardRepository.restore',
        }),
      );
      throw new Error('Card not restored');
    });
    await this.eventBus.publish(
      new RestoreCardEvent({
        cardId: cardToRestore.id,
      }),
    );
  }
}

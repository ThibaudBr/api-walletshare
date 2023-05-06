import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SoftDeleteCardCommand } from '../../command/soft-delete-card.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { SoftDeleteCardEvent } from '../../event/soft-delete-card.event';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { ErrorInvalidIdRuntimeException } from '../../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';

@CommandHandler(SoftDeleteCardCommand)
export class SoftDeleteCardCommandHandler implements ICommandHandler<SoftDeleteCardCommand> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SoftDeleteCardCommand): Promise<void> {
    const cardToDelete = await this.cardRepository
      .findOneOrFail({
        where: [{ id: command.id }],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'SoftDeleteCardCommandHandler',
            localisation: 'cardRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw new ErrorInvalidIdRuntimeException('Card not found');
      });

    await this.cardRepository.softRemove(cardToDelete).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'SoftDeleteCardCommandHandler',
          localisation: 'cardRepository.softRemove',
          error: error.message,
        }),
      );
      throw new Error('Card not soft-deleted');
    });
    await this.eventBus.publish(
      new SoftDeleteCardEvent({
        cardId: command.id,
      }),
    );
  }
}

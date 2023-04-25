import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCardCommand } from '../../command/delete-card.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { DeleteCardEvent } from '../../event/delete-card.event';
import { ErrorParameterNotProvidedRuntimeException } from '../../../../../../util/exception/runtime-exception/error-parameter-not-provided.runtime-exception';
import { ErrorInvalidIdRuntimeException } from '../../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';
import { ErrorDeleteRuntimeException } from '../../../../../../util/exception/runtime-exception/error-delete.runtime-exception';

@CommandHandler(DeleteCardCommand)
export class DeleteCardCommandHandler implements ICommandHandler<DeleteCardCommand> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteCardCommand): Promise<void> {
    try {
      if (!command.id) {
        throw new ErrorParameterNotProvidedRuntimeException('Card id not provided');
      }

      await this.cardRepository
        .findOneOrFail({
          withDeleted: true,
          where: [
            {
              id: command.id,
            },
          ],
        })
        .then(async card => {
          await this.cardRepository
            .remove(card)
            .then(() => {
              this.eventBus.publish(
                new DeleteCardEvent({
                  cardId: command.id,
                }),
              );
            })
            .catch(() => {
              throw new ErrorDeleteRuntimeException('Error while deleting in database');
            });
        })
        .catch(() => {
          throw new ErrorInvalidIdRuntimeException('Card not found');
        });
    } catch (e) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'DeleteCardCommandHandler',
          localisation: 'card',
          error: e.message,
        }),
      );
      throw e;
    }
  }
}

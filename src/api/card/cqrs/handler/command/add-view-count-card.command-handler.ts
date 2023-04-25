import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddViewCountCardCommand } from '../../command/add-view-count-card.command';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../domain/entities/card.entity';
import { Repository } from 'typeorm';
import { AddViewCountCardEvent } from '../../event/add-view-count-card.event';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { ErrorInvalidIdRuntimeException } from '../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';
import { ErrorUpdateRuntimeException } from '../../../../../util/exception/runtime-exception/error-group-request.runtime-exception';

@CommandHandler(AddViewCountCardCommand)
export class AddViewCountCardCommandHandler implements ICommandHandler<AddViewCountCardCommand> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddViewCountCardCommand): Promise<void> {
    try {
      await this.cardRepository
        .findOneOrFail({
          where: [
            {
              id: command.cardId,
            },
          ],
        })
        .catch(() => {
          throw new ErrorInvalidIdRuntimeException('Card not found');
        })
        .then(card => {
          this.cardRepository
            .update(card.id, {
              numberOfShares: card.numberOfShares + 1,
            })
            .then(() => {
              this.eventBus.publish(
                new AddViewCountCardEvent({
                  cardId: command.cardId,
                }),
              );
            })
            .catch(() => {
              throw new ErrorUpdateRuntimeException('Error while updating in database');
            });
        });
    } catch (e) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddViewCountCardCommandHandler',
          localisation: 'card',
          error: e.message,
        }),
      );
      throw e;
    }
  }
}

import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCardCommand } from '../../command/delete-card.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../domain/entities/card.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { DeleteCardEvent } from '../../event/delete-card.event';

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
        throw new Error('Card id not provided');
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
          this.cardRepository
            .delete(card.id)
            .then(() => {
              this.eventBus.publish(
                new DeleteCardEvent({
                  cardId: command.id,
                }),
              );
            })
            .catch(() => {
              throw new Error('Error while deleting in database');
            });
        })
        .catch(() => {
          throw new Error('Card not found');
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

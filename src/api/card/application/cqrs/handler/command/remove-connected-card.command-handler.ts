import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { RemoveConnectedCardEvent } from '../../event/remove-connected-card.event';
import { RemoveConnectedCardCommand } from '../../command/remove-connected-card.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedCardEntity } from '../../../../domain/entities/connected-card.entity';
import { Repository } from 'typeorm';
import { ErrorInvalidIdRuntimeException } from '../../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';
import { ErrorDeleteRuntimeException } from '../../../../../../util/exception/runtime-exception/error-delete.runtime-exception';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RemoveConnectedCardCommand)
export class RemoveConnectedCardCommandHandler implements ICommandHandler<RemoveConnectedCardCommand> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(ConnectedCardEntity)
    private readonly connectedCardRepository: Repository<ConnectedCardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveConnectedCardCommand): Promise<void> {
    try {
      const cardWhoRequest: CardEntity = await this.cardRepository
        .findOneOrFail({
          relations: [
            'connectedCardOne',
            'connectedCardTwo',
            'connectedCardOne.cardEntityOne',
            'connectedCardOne.cardEntityTwo',
            'connectedCardTwo.cardEntityOne',
            'connectedCardTwo.cardEntityTwo',
          ],
          where: [
            {
              id: command.id,
            },
          ],
        })
        .catch(() => {
          throw new ErrorInvalidIdRuntimeException('Card of sender not found');
        });

      const cardToDisconnect: CardEntity = await this.cardRepository
        .findOneOrFail({
          relations: [
            'connectedCardOne',
            'connectedCardTwo',
            'connectedCardOne.cardEntityOne',
            'connectedCardOne.cardEntityTwo',
            'connectedCardTwo.cardEntityOne',
            'connectedCardTwo.cardEntityTwo',
          ],
          where: [
            {
              id: command.connectedCardId,
            },
          ],
        })
        .catch(() => {
          throw new ErrorInvalidIdRuntimeException('Card of receiver not found');
        });

      if (!cardWhoRequest.connectedCardOne.map(card => card.id).includes(cardToDisconnect.id)) {
        await this.connectedCardRepository
          .findOneOrFail({
            relations: ['cardEntityOne', 'cardEntityTwo'],
            where: [
              {
                cardEntityOne: {
                  id: cardWhoRequest.id,
                },
                cardEntityTwo: {
                  id: cardToDisconnect.id,
                },
              },
            ],
          })
          .then(cardConnected => {
            this.connectedCardRepository
              .delete(cardConnected.id)
              .then(() => {
                this.eventBus.publish(
                  new RemoveConnectedCardEvent({
                    cardId: cardWhoRequest.id,
                    connectedCardId: cardToDisconnect.id,
                  }),
                );
              })
              .catch(() => {
                throw new ErrorDeleteRuntimeException('Error while deleting relation');
              });
          })
          .catch(() => {
            throw new ErrorInvalidIdRuntimeException('Error while fetching relation');
          });
      } else {
        await this.connectedCardRepository
          .findOneOrFail({
            relations: ['cardEntityOne', 'cardEntityTwo'],
            where: [
              {
                cardEntityOne: {
                  id: cardToDisconnect.id,
                },
                cardEntityTwo: {
                  id: cardWhoRequest.id,
                },
              },
            ],
          })
          .then(cardConnected => {
            this.connectedCardRepository
              .delete(cardConnected.id)
              .then(() => {
                this.eventBus.publish(
                  new RemoveConnectedCardEvent({
                    cardId: cardToDisconnect.id,
                    connectedCardId: cardWhoRequest.id,
                  }),
                );
              })
              .catch(() => {
                throw new ErrorDeleteRuntimeException('Error while deleting relation');
              });
          })
          .catch(() => {
            throw new ErrorInvalidIdRuntimeException('Error while fetching relation');
          });
      }
    } catch (error) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'RemoveConnectedCardCommandHandler',
          localisation: 'card',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}

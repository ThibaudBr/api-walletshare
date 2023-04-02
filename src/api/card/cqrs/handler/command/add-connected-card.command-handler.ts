import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddConnectedCardCommand } from '../../command/add-connected-card.command';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../domain/entities/card.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { Repository } from 'typeorm';
import { ConnectedCardEntity } from '../../../domain/entities/connected-card.entity';
import { AddConnectedCardEvent } from '../../event/add-connected-card.event';

@CommandHandler(AddConnectedCardCommand)
export class AddConnectedCardCommandHandler implements ICommandHandler<AddConnectedCardCommand> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(ConnectedCardEntity)
    private readonly connectedCardRepository: Repository<ConnectedCardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddConnectedCardCommand): Promise<void> {
    try {
      const cardWhoRequest: CardEntity = await this.cardRepository
        .findOneOrFail({
          relations: ['connectedCards'],
          where: [
            {
              id: command.cardId,
            },
          ],
        })
        .catch(() => {
          throw new Error('Card of sender not found');
        });

      const cardToConnect: CardEntity = await this.cardRepository
        .findOneOrFail({
          relations: ['connectedCards'],
          where: [
            {
              id: command.connectedCardId,
            },
          ],
        })
        .catch(() => {
          throw new Error('Card of receiver not found');
        });

      cardWhoRequest.connectedCardOne.forEach(card => {
        if (card.id === cardToConnect.id) {
          throw new Error('Card already connected');
        }
      });
      cardWhoRequest.connectedCardTwo.forEach(card => {
        if (card.id === cardToConnect.id) {
          throw new Error('Card already connected');
        }
      });
      await this.connectedCardRepository
        .save(
          new ConnectedCardEntity({
            cardEntityOne: cardWhoRequest,
            cardEntityTwo: cardToConnect,
          }),
        )
        .then(newConnectedCard => {
          this.eventBus.publish(
            new AddConnectedCardEvent({
              id: newConnectedCard.id,
              connectedCardId: newConnectedCard.cardEntityTwo.id,
            }),
          );
        })
        .catch(() => {
          throw new Error('Error while saving connected card');
        });
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'card',
          handler: 'AddConnectedCardCommandHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}

import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddConnectedCardCommand } from '../../command/add-connected-card.command';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { Repository } from 'typeorm';
import { ConnectedCardEntity } from '../../../../domain/entities/connected-card.entity';
import { AddConnectedCardEvent } from '../../event/add-connected-card.event';
import { ErrorInvalidIdRuntimeException } from '../../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';
import { ErrorCardAlreadyConnectedRuntimeException } from '../../../../../../util/exception/runtime-exception/error-card-already-connected.runtime-exception';
import { ErrorSaveRuntimeException } from '../../../../../../util/exception/runtime-exception/error-save.runtime-exception';

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
    const cardWhoRequest: CardEntity = await this.cardRepository
      .findOneOrFail({
        select: ['id'],
        relations: [
          'connectedCardOne',
          'connectedCardTwo',
          'connectedCardOne.cardEntityOne',
          'connectedCardOne.cardEntityTwo',
          'connectedCardTwo.cardEntityOne',
          'connectedCardTwo.cardEntityTwo',
          'owner',
          'owner.user',
        ],
        where: [
          {
            id: command.cardId,
          },
        ],
      })
      .catch(async () => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: 'Card of sender not found',
            handler: 'AddConnectedCardCommandHandler',
            localisation: 'cardRepository.findOneOrFail',
          }),
        );
        throw new ErrorInvalidIdRuntimeException('Card of sender not found');
      });

    const cardToConnect: CardEntity = await this.cardRepository
      .findOneOrFail({
        relations: [
          'connectedCardOne',
          'connectedCardTwo',
          'connectedCardOne.cardEntityOne',
          'connectedCardOne.cardEntityTwo',
          'connectedCardTwo.cardEntityOne',
          'connectedCardTwo.cardEntityTwo',
          'owner',
          'owner.user',
        ],
        where: [
          {
            id: command.connectedCardId,
          },
        ],
      })
      .catch(async () => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: 'Card of receiver not found',
            handler: 'AddConnectedCardCommandHandler',
            localisation: 'cardRepository.findOneOrFail',
          }),
        );
        throw new ErrorInvalidIdRuntimeException('Card of receiver not found');
      });

    if (cardWhoRequest.owner.user.id === cardToConnect.owner.user.id) {
      throw new Error('You can not connect your own card');
    }
    for (const card of cardWhoRequest.connectedCardOne) {
      if (card.cardEntityOne.id === cardToConnect.id) {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: 'Card already connected',
            handler: 'AddConnectedCardCommandHandler',
            localisation: 'cardRepository.findOneOrFail',
          }),
        );
        throw new ErrorCardAlreadyConnectedRuntimeException('Card already connected');
      }
      if (card.cardEntityTwo.id === cardToConnect.id) {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: 'Card already connected',
            handler: 'AddConnectedCardCommandHandler',
            localisation: 'cardRepository.findOneOrFail',
          }),
        );
        throw new ErrorCardAlreadyConnectedRuntimeException('Card already connected');
      }
    }
    for (const card of cardWhoRequest.connectedCardTwo) {
      if (card.cardEntityOne.id === cardToConnect.id) {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: 'Card already connected',
            handler: 'AddConnectedCardCommandHandler',
            localisation: 'cardRepository.findOneOrFail',
          }),
        );
        throw new ErrorCardAlreadyConnectedRuntimeException('Card already connected');
      }
      if (card.cardEntityTwo.id === cardToConnect.id) {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: 'Card already connected',
            handler: 'AddConnectedCardCommandHandler',
            localisation: 'cardRepository.findOneOrFail',
          }),
        );

        throw new ErrorCardAlreadyConnectedRuntimeException('Card already connected');
      }
    }
    await this.connectedCardRepository
      .save(
        new ConnectedCardEntity({
          cardEntityOne: cardWhoRequest,
          cardEntityTwo: cardToConnect,
        }),
      )
      .then(() => {
        this.eventBus.publish(
          new AddConnectedCardEvent({
            id: cardWhoRequest.id,
            connectedCardId: cardToConnect.id,
          }),
        );
      })
      .catch(async () => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: 'Error while saving connected card',
            handler: 'AddConnectedCardCommandHandler',
            localisation: 'connectedCardRepository.save',
          }),
        );
        throw new ErrorSaveRuntimeException('Error while saving connected card');
      });
  }
}

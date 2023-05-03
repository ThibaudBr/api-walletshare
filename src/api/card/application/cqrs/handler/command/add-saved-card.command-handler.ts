import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddSavedCardCommand } from '../../command/add-saved-card.command';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { AddSavedCardEvent } from '../../event/add-saved-card.event';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { ErrorInvalidIdRuntimeException } from '../../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';
import { ErrorUpdateRuntimeException } from '../../../../../../util/exception/runtime-exception/error-group-request.runtime-exception';

@CommandHandler(AddSavedCardCommand)
export class AddSavedCardCommandHandler implements ICommandHandler<AddSavedCardCommand> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddSavedCardCommand): Promise<void> {
    try {
      const profileEntity = await this.profileRepository
        .findOneOrFail({
          where: [
            {
              id: command.profileId,
            },
          ],
        })
        .catch(() => {
          throw new ErrorInvalidIdRuntimeException('Profile not found');
        });
      await this.cardRepository
        .findOneOrFail({
          relations: ['profilesWhoSavedCard'],
          where: [
            {
              id: command.cardId,
            },
          ],
        })
        .catch(() => {
          throw new ErrorInvalidIdRuntimeException('Card not found');
        })
        .then(async card => {
          if (card.profilesWhoSavedCard.find(profile => profile.id === profileEntity.id)) {
            throw new Error('Card already saved');
          }
          if (!card.profilesWhoSavedCard) card.profilesWhoSavedCard = [];
          card.profilesWhoSavedCard.push(profileEntity);
          await this.cardRepository
            .save(card)
            .then(async () => {
              await this.eventBus.publish(
                new AddSavedCardEvent({
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
          handler: 'AddSavedCardCommandHandler',
          localisation: 'card',
          error: e.message,
        }),
      );
      throw e;
    }
  }
}

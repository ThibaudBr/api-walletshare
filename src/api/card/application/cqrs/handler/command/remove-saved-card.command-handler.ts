import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveSavedCardCommand } from '../../command/remove-saved-card.command';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { RemoveSavedCardEvent } from '../../event/remove-saved-card.event';

@CommandHandler(RemoveSavedCardCommand)
export class RemoveSavedCardCommandHandler implements ICommandHandler<RemoveSavedCardCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileEntity: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveSavedCardCommand): Promise<void> {
    const profileToUpdate = await this.profileEntity
      .findOneOrFail({
        relations: ['savedCard'],
        where: {
          id: command.profileId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'RemoveSavedCardCommandHandler',
            localisation: 'profileRepository.findOneOrFail',
          }),
        );
        throw new Error('Profile not found');
      });

    if (!profileToUpdate.savedCard) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: 'Profile have no saved card',
          handler: 'RemoveSavedCardCommandHandler',
          localisation: 'profileToUpdate.savedCard',
        }),
      );
      throw new Error('Profile have no saved card');
    }
    const saveTemp = profileToUpdate.savedCard.length;
    profileToUpdate.savedCard = profileToUpdate.savedCard.filter((card: CardEntity) => card.id != command.cardId);
    if (saveTemp == profileToUpdate.savedCard.length) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: 'Card not saved in profile',
          handler: 'RemoveSavedCardCommandHandler',
          localisation: 'profileToUpdate.savedCard',
        }),
      );
      throw new Error('Card not saved in profile');
    }
    await this.profileEntity.save(profileToUpdate).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error.message,
          handler: 'RemoveSavedCardCommandHandler',
          localisation: 'profileRepository.save',
        }),
      );
    });

    await this.eventBus.publish(
      new RemoveSavedCardEvent({
        cardId: command.cardId,
        profileId: command.profileId,
      }),
    );
  }
}

import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCardCommand } from '../../command/update-card.command';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { OccupationEntity } from '../../../../../occupation/domain/entities/occupation.entity';
import { SocialNetworkEntity } from '../../../../../social-network/domain/entities/social-network.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { UpdateCardEvent } from '../../event/update-card.event';
import { ErrorInvalidIdRuntimeException } from '../../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';

@CommandHandler(UpdateCardCommand)
export class UpdateCardCommandHandler implements ICommandHandler<UpdateCardCommand> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    @InjectRepository(SocialNetworkEntity)
    private readonly socialNetworkRepository: Repository<SocialNetworkEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateCardCommand): Promise<void> {
    try {
      const cardToUpdate = await this.cardRepository
        .findOneOrFail({
          relations: ['owner', 'socialNetwork', 'occupations'],
          where: [
            {
              id: command.cardId,
            },
          ],
        })
        .catch(() => {
          throw new ErrorInvalidIdRuntimeException('Card not found');
        });

      if (command.profileId != undefined) {
        if (cardToUpdate.owner.id !== command.profileId) {
          cardToUpdate.owner = await this.profileRepository
            .findOneOrFail({
              where: [
                {
                  id: command.profileId,
                },
              ],
            })
            .catch(() => {
              throw new ErrorInvalidIdRuntimeException('Profile not found');
            })
            .then(profile => {
              return profile;
            });
        }
      }

      if (command.socialNetworkId != undefined) {
        if (cardToUpdate.socialNetwork.id !== command.socialNetworkId) {
          cardToUpdate.socialNetwork = await this.socialNetworkRepository
            .findOneOrFail({
              where: [
                {
                  id: command.socialNetworkId,
                },
              ],
            })
            .catch(() => {
              throw new ErrorInvalidIdRuntimeException('Social Network not found');
            })
            .then(socialNetwork => {
              return socialNetwork;
            });
        }
      }

      if (command.occupationsId != undefined) {
        for (const occupationId of command.occupationsId) {
          if (!cardToUpdate.occupations.find(occupation => occupation.id === occupationId)) {
            const occupation = await this.occupationRepository
              .findOneOrFail({
                where: [
                  {
                    id: occupationId,
                  },
                ],
              })
              .catch(() => {
                throw new ErrorInvalidIdRuntimeException('Occupation not found');
              })
              .then(occupation => {
                return occupation;
              });
            cardToUpdate.occupations.push(occupation);
          }
        }
      }

      const cardUpdated = new CardEntity({
        ...cardToUpdate,
        ...command,
      });

      await this.cardRepository
        .save(cardUpdated)
        .then(() => {
          this.eventBus.publish(
            new UpdateCardEvent({
              cardId: command.cardId,
            }),
          );
        })
        .catch(() => {
          throw new Error('Card not updated');
        });
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          error: error.message,
          handler: 'UpdateCardCommandHandler',
          localisation: 'card',
        }),
      );
      throw error;
    }
  }
}

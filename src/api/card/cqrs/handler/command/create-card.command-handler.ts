import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateCardCommand } from '../../command/create-card.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../../profile/domain/entities/profile.entity';
import { Repository } from 'typeorm';
import { CardEntity } from '../../../domain/entities/card.entity';
import { OccupationEntity } from '../../../../occupation/domain/entities/occupation.entity';
import { SocialNetworkEntity } from '../../../../social-network/domain/entities/social-network.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { TypeOfCardEnum } from '../../../domain/enum/type-of-card.enum';
import { CreateCardEvent } from '../../event/create-card.event';
import { ErrorInvalidIdRuntimeException } from '../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';
import { ErrorSaveRuntimeException } from '../../../../../util/exception/runtime-exception/error-save.runtime-exception';

@CommandHandler(CreateCardCommand)
export class CreateCardCommandHandler implements ICommandHandler<CreateCardCommand> {
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

  async execute(command: CreateCardCommand): Promise<void> {
    try {
      const newCard = new CardEntity({
        ...command,
      });
      newCard.owner = await this.profileRepository
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

      if (command.typeOfCardEnum === TypeOfCardEnum.SOCIAL_NETWORK) {
        newCard.socialNetwork = await this.socialNetworkRepository
          .findOneOrFail({
            where: [
              {
                id: command.socialNetworkId,
              },
            ],
          })
          .catch(() => {
            throw new ErrorInvalidIdRuntimeException('Social Network not found');
          });
      }

      if (command.occupationsId != undefined) {
        for (const occupationId of command.occupationsId) {
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
            });
          newCard.occupations.push(occupation);
        }
      }

      await this.cardRepository
        .save(newCard)
        .then(() => {
          this.eventBus.publish(
            new CreateCardEvent({
              cardId: newCard.id,
            }),
          );
        })
        .catch(() => {
          throw new ErrorSaveRuntimeException('Error saving card');
        });
    } catch (error) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'CreateCardCommandHandler',
          localisation: 'card',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}

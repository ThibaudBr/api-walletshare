import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CardDto } from '../../../domain/dto/card.dto';
import { GetSavedCardWithProfileIdQuery } from '../../query/get-saved-card-with-profile-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../domain/entities/card.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../../../profile/domain/entities/profile.entity';

@QueryHandler(GetSavedCardWithProfileIdQuery)
export class GetSavedCardWithProfileIdQueryHandler implements IQueryHandler<GetSavedCardWithProfileIdQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetSavedCardWithProfileIdQuery): Promise<CardDto[]> {
    try {
      const profile: ProfileEntity = await this.profileRepository
        .findOneOrFail({
          where: {
            id: query.profileId,
          },
        })
        .catch(() => {
          throw new Error('Profile not found');
        });
      const cards = await this.cardRepository.find({
        relations: ['occupation', 'owner', 'profilesWhoSavedCard', 'socialNetwork'],
        where: [
          {
            profilesWhoSavedCard: {
              id: profile.id,
            },
          },
        ],
      });

      return cards.map(
        card =>
          new CardDto({
            ...card,
            ownerId: card.owner ? card.owner.id : undefined,
            occupationsId: card.occupations
              ? card.occupations.map(occupation => {
                  return occupation.id;
                })
              : undefined,
          }),
      );
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'card',
          handler: 'GetSavedCardWithProfileIdQueryHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}

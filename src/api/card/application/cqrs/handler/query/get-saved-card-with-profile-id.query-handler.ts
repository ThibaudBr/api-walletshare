import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSavedCardWithProfileIdQuery } from '../../query/get-saved-card-with-profile-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';

@QueryHandler(GetSavedCardWithProfileIdQuery)
export class GetSavedCardWithProfileIdQueryHandler implements IQueryHandler<GetSavedCardWithProfileIdQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetSavedCardWithProfileIdQuery): Promise<CardEntity[]> {
    const profile: ProfileEntity = await this.profileRepository
      .findOneOrFail({
        where: {
          id: query.profileId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GetSavedCardWithProfileIdQueryHandler',
            localisation: 'profileRepository.findOneOrFail',
          }),
        );
        throw new Error('Profile not found');
      });
    return await this.cardRepository
      .find({
        relations: ['occupations', 'owner', 'profilesWhoSavedCard', 'socialNetwork'],
        where: [
          {
            profilesWhoSavedCard: {
              id: profile.id,
            },
          },
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetSavedCardWithProfileIdQueryHandler',
            localisation: 'cardRepository.find',
            error: error.message,
          }),
        );
        throw new Error('Cards not found');
      });
  }
}

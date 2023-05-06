import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllCardWithProfileIdQuery } from '../../query/get-all-card-with-profile-id.query';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllCardWithProfileIdQuery)
export class GetAllCardWithProfileIdQueryHandler implements IQueryHandler<GetAllCardWithProfileIdQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllCardWithProfileIdQuery): Promise<CardEntity[]> {
    const profile = await this.profileRepository
      .findOneOrFail({
        withDeleted: query.withDeleted,
        where: {
          id: query.profileId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GetAllCardWithProfileIdQueryHandler',
            localisation: 'profileRepository.findOneOrFail',
          }),
        );
        throw new Error('Profile not found');
      });

    return await this.cardRepository
      .find({
        withDeleted: query.withDeleted,
        relations: ['occupations', 'owner', 'socialNetwork'],
        where: [
          {
            owner: {
              id: profile.id,
            },
          },
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetAllCardWithProfileIdQueryHandler',
            localisation: 'cardRepository.find',
            error: error.message,
          }),
        );
        throw new Error('Cards not found');
      })
      .then(cards => {
        return cards;
      });
  }
}

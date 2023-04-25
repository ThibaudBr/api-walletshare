import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CardEntity } from '../../../domain/entities/card.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllCardWithProfileIdQuery } from '../../query/get-all-card-with-profile-id.query';
import { ProfileEntity } from '../../../../profile/domain/entities/profile.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';

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
    try {
      const profile = await this.profileRepository
        .findOneOrFail({
          withDeleted: query.withDeleted,
          where: {
            id: query.profileId,
          },
        })
        .catch(() => {
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
        .catch(() => {
          throw new Error('Cards not found');
        })
        .then(cards => {
          return cards;
        });
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'card',
          handler: 'GetAllCardWithProfileIdQueryHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}

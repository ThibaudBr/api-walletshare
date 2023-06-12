import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllConnectedCardByProfileIdQuery } from '../../query/get-all-connected-card-by-profile-id.query';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllConnectedCardByProfileIdQuery)
export class GetAllConnectedCardByProfileIdQueryHandler implements IQueryHandler<GetAllConnectedCardByProfileIdQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllConnectedCardByProfileIdQuery): Promise<CardEntity[]> {
    const profile: ProfileEntity = await this.profileRepository
      .findOneOrFail({
        where: {
          id: query.profileId,
        },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GetAllConnectedCardByProfileIdQueryHandler',
            localisation: 'profileRepository.findOneOrFail',
          }),
        );
        throw new Error('Profile not found');
      });

    return await this.cardRepository
      .find({
        relations: [
          'occupations',
          'owner',
          'socialNetwork',
          'connectedCardTwo',
          'connectedCardTwo.cardEntityTwo',
          'connectedCardTwo.cardEntityOne',
          'connectedCardTwo.cardEntityTwo.owner',
          'connectedCardTwo.cardEntityOne.owner',
          'connectedCardOne',
          'connectedCardOne.cardEntityTwo',
          'connectedCardOne.cardEntityOne',
          'connectedCardOne.cardEntityTwo.owner',
          'connectedCardOne.cardEntityOne.owner',
        ],
        where: [
          {
            connectedCardTwo: {
              cardEntityTwo: {
                owner: {
                  id: profile.id,
                },
              },
            },
          },
          {
            connectedCardTwo: {
              cardEntityOne: {
                owner: {
                  id: profile.id,
                },
              },
            },
          },
          {
            connectedCardOne: {
              cardEntityTwo: {
                owner: {
                  id: profile.id,
                },
              },
            },
          },
          {
            connectedCardOne: {
              cardEntityOne: {
                owner: {
                  id: profile.id,
                },
              },
            },
          },
        ],
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetAllConnectedCardByProfileIdQueryHandler',
            localisation: 'cardRepository.find',
            error: error.message,
          }),
        );
        throw new Error('Cards not found');
      })
      .then((cardEntities: CardEntity[]) => {
        return cardEntities
          .map((cardEntity: CardEntity) => cardEntity)
          .filter((cardEntity: CardEntity) => cardEntity.owner.id !== query.profileId);
      });
  }
}

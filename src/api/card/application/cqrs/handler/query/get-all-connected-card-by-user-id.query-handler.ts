import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllConnectedCardByUserIdQuery } from '../../query/get-all-connected-card-by-user-id.query';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllConnectedCardByUserIdQuery)
export class GetAllConnectedCardByUserIdQueryHandler implements IQueryHandler<GetAllConnectedCardByUserIdQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllConnectedCardByUserIdQuery): Promise<CardEntity[]> {
    return await this.cardRepository
      .find({
        relations: [
          'occupations',
          'owner',
          'owner.user',
          'connectedCardOne',
          'connectedCardOne.cardEntityOne',
          'connectedCardOne.cardEntityOne.owner',
          'connectedCardOne.cardEntityOne.owner.user',
          'connectedCardOne.cardEntityTwo',
          'connectedCardOne.cardEntityTwo.owner',
          'connectedCardOne.cardEntityTwo.owner.user',
          'connectedCardTwo',
          'connectedCardTwo.cardEntityOne',
          'connectedCardTwo.cardEntityOne.owner',
          'connectedCardTwo.cardEntityOne.owner.user',
          'connectedCardTwo.cardEntityTwo',
          'connectedCardTwo.cardEntityTwo.owner',
          'connectedCardTwo.cardEntityTwo.owner.user',
        ],
        where: [
          {
            connectedCardOne: {
              cardEntityOne: {
                owner: {
                  user: {
                    id: query.userId,
                  },
                },
              },
            },
          },
          {
            connectedCardOne: {
              cardEntityTwo: {
                owner: {
                  user: {
                    id: query.userId,
                  },
                },
              },
            },
          },
          {
            connectedCardTwo: {
              cardEntityOne: {
                owner: {
                  user: {
                    id: query.userId,
                  },
                },
              },
            },
          },
          {
            connectedCardTwo: {
              cardEntityTwo: {
                owner: {
                  user: {
                    id: query.userId,
                  },
                },
              },
            },
          },
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetAllCardWithUserIdQueryHandler',
            localisation: 'cardRepository.find',
            error: error.message,
          }),
        );
        throw new Error('invalidId');
      })
      .then(async cards => {
        const uniqueCardIds = new Set();
        return cards.filter(card => {
          if (card.owner.user.id === query.userId) {
            return false;
          }
          if (uniqueCardIds.has(card.id)) {
            return false;
          }
          uniqueCardIds.add(card.id);
          return true;
        });
      });
  }
}

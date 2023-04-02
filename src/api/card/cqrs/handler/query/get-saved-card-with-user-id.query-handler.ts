import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CardDto } from '../../../domain/dto/card.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../domain/entities/card.entity';
import { UserEntity } from '../../../../user/domain/entities/user.entity';
import { GetSavedCardWithUserIdQuery } from '../../query/get-saved-card-with-user-id.query';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetSavedCardWithUserIdQuery)
export class GetSavedCardWithUserIdQueryHandler implements IQueryHandler<GetSavedCardWithUserIdQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetSavedCardWithUserIdQuery): Promise<CardDto[]> {
    try {
      const user = await this.userRepository
        .findOneOrFail({
          where: [
            {
              id: query.userId,
            },
          ],
        })
        .catch(() => {
          throw new Error('User not found');
        });

      return await this.cardRepository
        .find({
          relations: ['occupation', 'socialNetwork', 'owner', 'profilesWhoSavedCard', 'profilesWhoSavedCard.user'],
          where: [
            {
              profilesWhoSavedCard: {
                user: {
                  id: user.id,
                },
              },
            },
          ],
        })
        .then(cards => {
          return cards.map(card => {
            return new CardDto({
              ...card,
              ownerId: card.owner ? card.owner.id : undefined,
              occupationsId: card.occupations
                ? card.occupations.map(occupation => {
                    return occupation.id;
                  })
                : undefined,
            });
          });
        });
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'card',
          handler: 'GetSavedCardWithUserIdQueryHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}

import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../domain/entities/card.entity';
import { Repository } from 'typeorm';
import { CardResponse } from '../../../web/response/card.response';
import { GetAllCardWithUserIdQuery } from '../../query/get-all-card-with-user-id.query';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { CardDto } from "../../../domain/dto/card.dto";

@QueryHandler(GetAllCardWithUserIdQuery)
export class GetAllCardWithUserIdQueryHandler implements IQueryHandler<GetAllCardWithUserIdQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllCardWithUserIdQuery): Promise<CardDto[]> {
    try {
      const cards = await this.cardRepository.find({
        relations: ['occupation', 'owner', 'owner.user', 'socialNetwork'],
        loadRelationIds: true,
        loadEagerRelations: true,
        where: [
          {
            owner: {
              user: {
                id: query.userId,
              },
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
          handler: 'GetAllCardWithUserIdQueryHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}

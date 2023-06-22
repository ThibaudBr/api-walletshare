import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { Repository } from 'typeorm';
import { GetAllCardWithUserIdQuery } from '../../query/get-all-card-with-user-id.query';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllCardWithUserIdQuery)
export class GetAllCardWithUserIdQueryHandler implements IQueryHandler<GetAllCardWithUserIdQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllCardWithUserIdQuery): Promise<CardEntity[]> {
    return await this.cardRepository
      .find({
        relations: ['occupations', 'owner', 'owner.user', 'socialNetwork'],
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
      });
  }
}

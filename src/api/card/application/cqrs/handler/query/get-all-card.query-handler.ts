import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetAllCardQuery } from '../../query/get-all-card.query';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllCardQuery)
export class GetAllCardQueryHandler implements IQueryHandler<GetAllCardQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<CardEntity[]> {
    return await this.cardRepository
      .find({
        relations: ['occupations', 'owner', 'socialNetwork', 'owner.user'],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetAllCardQueryHandler',
            localisation: 'cardRepository.find',
            error: error.message,
          }),
        );
        throw new Error('Cards not found');
      });
  }
}

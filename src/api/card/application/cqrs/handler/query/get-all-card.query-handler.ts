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
    try {
      return await this.cardRepository.find({
        relations: ['occupations', 'owner', 'socialNetwork', 'owner.user'],
      });
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'card',
          handler: 'GetAllCardQueryHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}

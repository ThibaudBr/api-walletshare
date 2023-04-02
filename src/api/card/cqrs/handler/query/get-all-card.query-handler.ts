import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetAllCardQuery } from '../../query/get-all-card.query';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../domain/entities/card.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { CardDto } from '../../../domain/dto/card.dto';

@QueryHandler(GetAllCardQuery)
export class GetAllCardQueryHandler implements IQueryHandler<GetAllCardQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<CardDto[]> {
    try {
      const cards = await this.cardRepository.find({
        relations: ['occupation', 'owner', 'socialNetwork'],
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
          handler: 'GetAllCardQueryHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}

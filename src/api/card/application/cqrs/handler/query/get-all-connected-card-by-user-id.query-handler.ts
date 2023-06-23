import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllConnectedCardByUserIdQuery } from '../../query/get-all-connected-card-by-user-id.query';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Not, Repository } from 'typeorm';
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
      .createQueryBuilder('card')
      .leftJoinAndSelect('card.occupations', 'occupations')
      .leftJoinAndSelect('card.owner', 'owner')
      .leftJoinAndSelect('owner.user', 'user')
      .leftJoinAndSelect('card.connectedCardOne', 'connectedCardOne')
      .leftJoinAndSelect('connectedCardOne.cardEntityOne', 'cardEntityOne')
      .leftJoinAndSelect('cardEntityOne.owner', 'ownerOne')
      .leftJoinAndSelect('ownerOne.user', 'userOne')
      .leftJoinAndSelect('card.connectedCardTwo', 'connectedCardTwo')
      .leftJoinAndSelect('connectedCardTwo.cardEntityTwo', 'cardEntityTwo')
      .leftJoinAndSelect('cardEntityTwo.owner', 'ownerTwo')
      .leftJoinAndSelect('ownerTwo.user', 'userTwo')
      .where('user.id != :userId', { userId: query.userId })
      .andWhere(
        new Brackets(qb => {
          qb.where('userOne.id = :userId', { userId: query.userId }).orWhere('userTwo.id = :userId', {
            userId: query.userId,
          });
        }),
      )
      .getMany()
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetAllCardWithUserIdQueryHandler',
            localisation: 'cardRepository.find',
            error: error.message,
          }),
        );
        throw new Error('Error while getting all connected card by user id');
      });
  }
}

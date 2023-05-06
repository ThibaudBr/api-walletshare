import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCardWithCriteriaQuery } from '../../query/get-card-with-criteria.query';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../../domain/entities/card.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetCardWithCriteriaQuery)
export class GetCardWithCriteriaQueryHandler implements IQueryHandler<GetCardWithCriteriaQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCardWithCriteriaQuery): Promise<CardEntity[]> {
    const queryBuilder = this.cardRepository.createQueryBuilder('card');

    if (query.isDeleted) {
      queryBuilder.setFindOptions({
        withDeleted: true,
        relations: ['owner', 'occupations', 'socialNetwork', 'owner.user', 'cardViews'],
      });
    } else {
      queryBuilder.setFindOptions({
        relations: ['owner', 'occupations', 'socialNetwork', 'owner.user', 'cardViews'],
      });
    }

    if (query.isOwnerPro !== undefined) {
      queryBuilder.where('card.isOwnerPro = :isOwnerPro', {
        isOwnerPro: query.isOwnerPro,
      });
    }

    if (query.companyName != undefined) {
      queryBuilder.where('card.companyName = :companyName', {
        companyName: query.companyName,
      });
    }

    if (query.typeOfCardEnum != undefined) {
      queryBuilder.where('card.typeOfCardEnum = :typeOfCardEnum', {
        typeOfCardEnum: query.typeOfCardEnum,
      });
    }

    if (query.firstname != undefined) {
      queryBuilder.where('card.firstname = :firstname', {
        firstname: query.firstname,
      });
    }

    if (query.lastname != undefined) {
      queryBuilder.where('card.lastname = :lastname', {
        lastname: query.lastname,
      });
    }

    return await queryBuilder
      .getMany()
      .then(cards => {
        return cards;
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetCardWithCriteriaQueryHandler',
            localisation: 'cardRepository.find',
            error: error.message,
          }),
        );
        throw new Error('Error while getting cards');
      });
  }
}

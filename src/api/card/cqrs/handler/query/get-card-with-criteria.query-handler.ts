import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCardWithCriteriaQuery } from '../../query/get-card-with-criteria.query';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../../domain/entities/card.entity';
import { Repository } from 'typeorm';
import { CardDto } from '../../../domain/dto/card.dto';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetCardWithCriteriaQuery)
export class GetCardWithCriteriaQueryHandler implements IQueryHandler<GetCardWithCriteriaQuery> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCardWithCriteriaQuery): Promise<CardEntity[]> {
    try {
      const queryBuilder = this.cardRepository.createQueryBuilder('card');
      queryBuilder.setFindOptions({
        relations: ['owner', 'occupations', 'socialNetwork', 'owner.user'],
      });

      if (query.isDeleted) {
        queryBuilder.setFindOptions({ withDeleted: true });
      }

      if (query.isOwnerPro !== undefined) {
        queryBuilder.setFindOptions({
          where: {
            isOwnerPro: query.isOwnerPro,
          },
        });
      }

      if (query.companyName != undefined) {
        queryBuilder.setFindOptions({
          where: {
            companyName: query.companyName,
          },
        });
      }

      if (query.typeOfCardEnum != undefined) {
        queryBuilder.setFindOptions({
          where: {
            typeOfCardEnum: query.typeOfCardEnum,
          },
        });
      }

      if (query.firstname != undefined) {
        queryBuilder.setFindOptions({
          where: {
            firstname: query.firstname,
          },
        });
      }

      if (query.lastname != undefined) {
        queryBuilder.setFindOptions({
          where: {
            lastname: query.lastname,
          },
        });
      }

      return await queryBuilder
        .getMany()
        .then(cards => {
          return cards;
        })
        .catch(error => {
          throw new Error('Error while getting cards');
        });
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'card',
          handler: 'GetCardWithCriteriaQueryHandler',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}

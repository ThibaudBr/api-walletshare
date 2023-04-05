import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetGroupRequestWithCriteriaQuery } from '../../query/get-group-request-with-criteria.query';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRequestEntity } from '../../../domain/entities/group-request.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetGroupRequestWithCriteriaQuery)
export class GetGroupRequestWithCriteriaQueryHandler implements IQueryHandler<GetGroupRequestWithCriteriaQuery> {
  constructor(
    @InjectRepository(GroupRequestEntity)
    private readonly groupRequestRepository: Repository<GroupRequestEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetGroupRequestWithCriteriaQuery): Promise<GroupRequestEntity[]> {
    const groupRequest = await this.groupRequestRepository.createQueryBuilder('groupRequest');
    groupRequest.setFindOptions({ relations: ['card', 'group'] });

    if (query.groupId) {
      groupRequest.andWhere('groupRequest.groupId = :groupId', { groupId: query.groupId });
    }

    if (query.cardId) {
      groupRequest.andWhere('groupRequest.cardId = :cardId', { cardId: query.cardId });
    }

    if (query.isDeleted) {
      groupRequest.andWhere('groupRequest.isDeleted = :isDeleted', { isDeleted: query.isDeleted });
    }

    if (query.id) {
      groupRequest.andWhere('groupRequest.id = :id', { id: query.id });
    }

    return groupRequest.getMany().catch(error => {
      this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'group',
          handler: 'GetGroupRequestWithCriteriaQueryHandler',
          error: error.message,
        }),
      );
      throw new Error('Invalid id');
    });
  }
}

import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { Repository } from 'typeorm';
import { GetGroupWithCriteriaQuery } from '../../query/get-group-with-criteria.query';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { ErrorGetWithCriteriaRuntimeException } from '../../../../../../util/exception/runtime-exception/error-get-with-criteria.runtime-exception';

@QueryHandler(GetGroupWithCriteriaQuery)
export class GetGroupWithCriteriaQueryHandler implements IQueryHandler<GetGroupWithCriteriaQuery> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetGroupWithCriteriaQuery): Promise<GroupEntity[]> {
    const groupQueryBuilder = this.groupRepository.createQueryBuilder('group');
    groupQueryBuilder.setFindOptions({ relations: ['members', 'members.card', 'groupRequests'] });

    if (query.name) {
      groupQueryBuilder.andWhere('group.name = :name', { name: query.name });
    }

    if (query.isDeleted) {
      groupQueryBuilder.setFindOptions({ withDeleted: true });
    }

    if (query.cardId) {
      groupQueryBuilder.andWhere('group.cardId = :cardId', { cardId: query.cardId });
    }

    if (query.createAtFrom) {
      groupQueryBuilder.andWhere('group.createAt >= :createAtFrom', { createAtFrom: query.createAtFrom });
    }

    if (query.createAtTo) {
      groupQueryBuilder.andWhere('group.createAt <= :createAtTo', { createAtTo: query.createAtTo });
    }

    if (query.updateAtFrom) {
      groupQueryBuilder.andWhere('group.updateAt >= :updateAtFrom', { updateAtFrom: query.updateAtFrom });
    }

    if (query.updateAtTo) {
      groupQueryBuilder.andWhere('group.updateAt <= :updateAtTo', { updateAtTo: query.updateAtTo });
    }

    if (query.deleteAtFrom) {
      groupQueryBuilder.andWhere('group.deleteAt >= :deleteAtFrom', { deleteAtFrom: query.deleteAtFrom });
    }

    return await groupQueryBuilder.getMany().catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'group',
          handler: 'GetGroupWithCriteriaQueryHandler',
          error: error.message,
        }),
      );
      throw new ErrorGetWithCriteriaRuntimeException('Error while getting group with criteria');
    });
  }
}

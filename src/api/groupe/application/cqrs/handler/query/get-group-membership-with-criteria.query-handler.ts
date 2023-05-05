import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GroupMembershipEntity } from '../../../../domain/entities/group-membership.entity';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetGroupMembershipWithCriteriaQuery } from '../../query/get-group-membership-with-criteria.query';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetGroupMembershipWithCriteriaQuery)
export class GetGroupMembershipWithCriteriaQueryHandler implements IQueryHandler<GetGroupMembershipWithCriteriaQuery> {
  constructor(
    @InjectRepository(GroupMembershipEntity)
    private readonly groupMembershipRepository: Repository<GroupMembershipEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetGroupMembershipWithCriteriaQuery): Promise<GroupMembershipEntity[]> {
    const groupMembershipQueryBuilder = this.groupMembershipRepository.createQueryBuilder('groupMembership');
    groupMembershipQueryBuilder.setFindOptions({ relations: ['card', 'group'] });

    if (query.groupId) {
      groupMembershipQueryBuilder.setFindOptions({
        where: {
          group: {
            id: query.groupId,
          },
        },
      });
    }

    if (query.cardId) {
      groupMembershipQueryBuilder.setFindOptions({
        where: {
          card: {
            id: query.cardId,
          },
        },
      });
    }

    if (query.isDeleted) {
      groupMembershipQueryBuilder.setFindOptions({ withDeleted: true });
    }

    if (query.createdAtFrom) {
      groupMembershipQueryBuilder.setFindOptions({
        where: {
          createdAt: MoreThan(query.createdAtFrom),
        },
      });
    }

    if (query.createdAtTo) {
      groupMembershipQueryBuilder.setFindOptions({
        where: {
          createdAt: MoreThan(query.createdAtTo),
        },
      });
    }

    if (query.updatedAtFrom) {
      groupMembershipQueryBuilder.setFindOptions({
        where: {
          updatedAt: MoreThan(query.updatedAtFrom),
        },
      });
    }

    if (query.updatedAtTo) {
      groupMembershipQueryBuilder.setFindOptions({
        where: {
          updatedAt: MoreThan(query.updatedAtTo),
        },
      });
    }

    if (query.deletedAtFrom) {
      groupMembershipQueryBuilder.setFindOptions({
        where: {
          deletedAt: MoreThan(query.deletedAtFrom),
        },
      });
    }

    if (query.deletedAtTo) {
      groupMembershipQueryBuilder.setFindOptions({
        where: {
          deletedAt: MoreThan(query.deletedAtTo),
        },
      });
    }

    return groupMembershipQueryBuilder.getMany().catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'group',
          handler: 'GetGroupMembershipWithCriteriaQueryHandler',
          error: error.message,
        }),
      );
      throw new Error('Invalid id');
    });
  }
}

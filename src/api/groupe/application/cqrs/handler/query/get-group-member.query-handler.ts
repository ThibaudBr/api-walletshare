import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetGroupMemberQuery } from '../../query/get-group-member.query';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { GroupMembershipEntity } from '../../../../domain/entities/group-membership.entity';

@QueryHandler(GetGroupMemberQuery)
export class GetGroupMemberQueryHandler implements IQueryHandler<GetGroupMemberQuery> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetGroupMemberQuery): Promise<GroupMembershipEntity[]> {
    return await this.groupRepository
      .findOneOrFail({
        relations: ['members'],
        where: [
          {
            id: query.groupId,
          },
        ],
      })
      .then(async group => {
        return group.members;
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'groupRepository.findOneOrFail',
            handler: 'GetGroupByIdQueryHandler',
            error: error.message,
          }),
        );
        throw new Error('Invalid id');
      });
  }
}
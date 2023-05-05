import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMembershipEntity } from '../../../../domain/entities/group-membership.entity';
import { GetGroupMembershipWithCardIdQuery } from '../../query/get-group-membership-with-card-id.query';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetGroupMembershipWithCardIdQuery)
export class GetGroupMembershipWithCardIdQueryHandler implements IQueryHandler<GetGroupMembershipWithCardIdQuery> {
  constructor(
    @InjectRepository(GroupMembershipEntity)
    private readonly groupMembershipRepository: Repository<GroupMembershipEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetGroupMembershipWithCardIdQuery): Promise<GroupMembershipEntity[]> {
    return await this.groupMembershipRepository
      .find({
        relations: ['group', 'card'],
        where: [
          {
            card: {
              id: query.cardId,
            },
          },
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'GetGroupMembershipWithCardIdQueryHandler',
            error: error.message,
          }),
        );
        throw new Error('Invalid id');
      });
  }
}

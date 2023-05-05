import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetGroupWhereUserIdIsMemberQuery } from '../../query/get-group-where-user-id-is-member.query';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetGroupWhereUserIdIsMemberQuery)
export class GetGroupWhereUserIdIsMemberQueryHandler implements IQueryHandler<GetGroupWhereUserIdIsMemberQuery> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetGroupWhereUserIdIsMemberQuery): Promise<GroupEntity[]> {
    return await this.groupRepository
      .find({
        relations: ['members', 'members.card', 'members.card.owner', 'members.card.owner.user'],
        where: {
          members: {
            card: {
              owner: {
                user: {
                  id: query.userId,
                },
              },
            },
          },
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'GetGroupWhereUserIdIsMemberQueryHandler',
            error: error.message,
          }),
        );
        throw error;
      });
  }
}

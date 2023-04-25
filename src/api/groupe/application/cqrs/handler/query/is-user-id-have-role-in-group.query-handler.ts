import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { GroupMembershipEntity } from '../../../../domain/entities/group-membership.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsUserIdHaveRoleInGroupQuery } from '../../query/is-user-id-have-role-in-group.query';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(IsUserIdHaveRoleInGroupQuery)
export class IsUserIdHaveRoleInGroupQueryHandler implements IQueryHandler<IsUserIdHaveRoleInGroupQuery> {
  constructor(
    @InjectRepository(GroupMembershipEntity)
    private readonly groupMembershipRepository: Repository<GroupMembershipEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: IsUserIdHaveRoleInGroupQuery): Promise<boolean> {
    return await this.groupMembershipRepository
      .find({
        relations: ['group', 'card', 'card.owner', 'owner.user'],
        where: [
          {
            group: {
              id: query.groupId,
            },
            card: {
              owner: {
                user: {
                  id: query.userId,
                },
              },
            },
          },
        ],
      })
      .then(groupMemberships => {
        return groupMemberships.some(groupMembership => {
          return query.roles.includes(groupMembership.role);
        });
      })
      .catch(async () => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'IsUserIdHaveRoleInGroupQueryHandler',
            error: 'User is not in group',
          }),
        );
        throw new Error('User is not in group');
      });
  }
}

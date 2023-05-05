import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GetGroupWhereCardIsAdminQuery } from '../../query/get-group-where-card-is-admin.query';
import { Repository } from 'typeorm';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { RoleGroupMembershipEnum } from '../../../../domain/enum/role-group-membership.enum';

@EventsHandler(GetGroupWhereCardIsAdminQuery)
export class GetGroupWhereCardIsAdminQueryHandler implements IEventHandler<GetGroupWhereCardIsAdminQuery> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async handle(event: GetGroupWhereCardIsAdminQuery): Promise<GroupEntity[]> {
    return await this.groupRepository
      .find({
        relations: ['member', 'member.card', 'owner', 'owner.card'],
        where: [
          {
            members: {
              card: {
                id: event.cardId,
              },
              role: RoleGroupMembershipEnum.ADMIN,
            },
          },
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'GetGroupWhereCardIsAdminQueryHandler',
            error: error.message,
          }),
        );
        throw new Error('Invalid id');
      });
  }
}

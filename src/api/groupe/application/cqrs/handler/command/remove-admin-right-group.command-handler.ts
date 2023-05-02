import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveAdminRightGroupCommand } from '../../command/remove-admin-right-group.command';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMembershipEntity } from '../../../../domain/entities/group-membership.entity';
import { RoleGroupMembershipEnum } from '../../../../domain/enum/role-group-membership.enum';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { RemoveAdminRightGroupEvent } from '../../event/remove-admin-right-group.event';

@CommandHandler(RemoveAdminRightGroupCommand)
export class RemoveAdminRightGroupCommandHandler implements ICommandHandler<RemoveAdminRightGroupCommand> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(GroupMembershipEntity)
    private readonly groupMembershipRepository: Repository<GroupMembershipEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveAdminRightGroupCommand): Promise<void> {
    const group: GroupEntity = await this.groupRepository
      .findOneOrFail({
        relations: ['groupMemberships', 'groupMemberships.card'],
        where: [
          {
            id: command.groupId,
          },
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'RemoveAdminRightGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Invalid id');
      });

    if (group.members.filter(member => member.id === command.cardId).length === 0) {
      throw new Error('Card is not in this group');
    }

    const groupMembership: GroupMembershipEntity = await this.groupMembershipRepository
      .findOneOrFail({
        relations: ['card', 'group'],
        where: [
          {
            card: {
              id: command.cardId,
            },
            group: {
              id: command.groupId,
            },
          },
        ],
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'RemoveAdminRightGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Invalid id');
      });

    if (groupMembership.role === RoleGroupMembershipEnum.ADMIN) {
      groupMembership.role = RoleGroupMembershipEnum.MEMBER;
      await this.groupMembershipRepository.save(groupMembership);
      await this.eventBus.publish(new RemoveAdminRightGroupEvent({ cardId: command.cardId, groupId: command.groupId }));
    }
  }
}

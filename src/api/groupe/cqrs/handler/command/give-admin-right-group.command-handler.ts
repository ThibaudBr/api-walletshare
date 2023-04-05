import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { GiveAdminRightGroupCommand } from '../../command/give-admin-right-group.command';
import { Repository } from 'typeorm';
import { GroupEntity } from '../../../domain/entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { GroupMembershipEntity } from '../../../domain/entities/group-membership.entity';
import { CardEntity } from '../../../../card/domain/entities/card.entity';
import { RoleGroupMembershipEnum } from '../../../domain/enum/role-group-membership.enum';
import { GiveAdminRightGroupEvent } from '../../event/give-admin-right-group.event';

@CommandHandler(GiveAdminRightGroupCommand)
export class GiveAdminRightGroupCommandHandler implements ICommandHandler<GiveAdminRightGroupCommand> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(GroupMembershipEntity)
    private readonly groupMembershipRepository: Repository<GroupMembershipEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: GiveAdminRightGroupCommand): Promise<void> {
    const group: GroupEntity = await this.groupRepository
      .findOneOrFail({
        relations: ['groupMemberships', 'groupMemberships.card'],
        where: [
          {
            id: command.groupId,
          },
        ],
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'GiveAdminRightGroupCommandHandler',
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
        relations: ['card'],
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
            handler: 'GiveAdminRightGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Invalid id');
      });

    groupMembership.role = RoleGroupMembershipEnum.ADMIN;

    await this.groupMembershipRepository
      .save(groupMembership)
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'GiveAdminRightGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Error while giving admin right');
      })
      .then(() => {
        this.eventBus.publish(
          new GiveAdminRightGroupEvent({
            groupId: command.groupId,
            cardId: command.cardId,
          }),
        );
      });
  }
}

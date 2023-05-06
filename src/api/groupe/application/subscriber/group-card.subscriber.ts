import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { CardEntity } from '../../../card/domain/entities/card.entity';
import { GroupEntity } from '../../domain/entities/group.entity';
import { GroupMembershipEntity } from '../../domain/entities/group-membership.entity';
import { RoleGroupMembershipEnum } from '../../domain/enum/role-group-membership.enum';

@EventSubscriber()
export class GroupMembershipCardSubscriber implements EntitySubscriberInterface<CardEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return CardEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<CardEntity>): Promise<void> {
    const softRemovedCard: CardEntity | undefined = event.entity;
    const groupMembershipRepository: Repository<GroupMembershipEntity> =
      event.manager.getRepository(GroupMembershipEntity);
    const groupRepository: Repository<GroupEntity> = event.manager.getRepository(GroupEntity);
    const groupMemberships: GroupMembershipEntity[] = await groupMembershipRepository.find({
      relations: ['group', 'card', 'group.members', 'group.members.card'],
      where: {
        card: {
          id: softRemovedCard?.id,
        },
      },
    });
    if (groupMemberships.length == 0) return;
    for (const groupMembership of groupMemberships) {
      if (groupMembership.group.members.length == 2 || groupMembership.role == RoleGroupMembershipEnum.OWNER) {
        await groupRepository.softRemove(groupMembership.group);
      } else {
        await groupMembershipRepository.softRemove(groupMembership);
      }
    }
  }

  async beforeRemove(event: RemoveEvent<CardEntity>): Promise<void> {
    const removedCard: CardEntity | undefined = event.entity;
    const groupMembershipRepository: Repository<GroupMembershipEntity> =
      event.manager.getRepository(GroupMembershipEntity);
    const groupRepository: Repository<GroupEntity> = event.manager.getRepository(GroupEntity);
    const groupMemberships: GroupMembershipEntity[] = await groupMembershipRepository.find({
      relations: ['group', 'card', 'group.members', 'group.members.card'],
      withDeleted: true,
      where: {
        card: {
          id: removedCard?.id,
        },
      },
    });
    if (groupMemberships.length == 0) return;
    for (const groupMembership of groupMemberships) {
      if (groupMembership.group.members.length == 2 || groupMembership.role == RoleGroupMembershipEnum.OWNER) {
        await groupRepository.remove(groupMembership.group);
      } else {
        await groupMembershipRepository.remove(groupMembership);
      }
    }
  }
}

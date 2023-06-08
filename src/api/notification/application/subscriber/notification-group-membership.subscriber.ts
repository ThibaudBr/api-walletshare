import { EntitySubscriberInterface, EventSubscriber, InsertEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { GroupMembershipEntity } from '../../../groupe/domain/entities/group-membership.entity';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationTypeEnum } from '../../domain/enum/notification-type.enum';

@EventSubscriber()
export class NotificationGroupMembershipSubscriber implements EntitySubscriberInterface<GroupMembershipEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return GroupMembershipEntity;
  }

  async afterInsert(event: InsertEvent<GroupMembershipEntity>): Promise<void> {
    const InsertedGroupMembership: GroupMembershipEntity | undefined = event.entity;
    const notificationRepository: Repository<NotificationEntity> = event.manager.getRepository(NotificationEntity);
    const groupMembershipRepository: Repository<GroupMembershipEntity> =
      event.manager.getRepository(GroupMembershipEntity);
    const groupMembership: GroupMembershipEntity | null = await groupMembershipRepository.findOne({
      relations: ['group'],
      where: {
        id: InsertedGroupMembership?.id,
      },
    });
    const groupMemberships: GroupMembershipEntity[] = await groupMembershipRepository.find({
      relations: ['group', 'card', 'card.owner', 'card.owner.user'],
      where: {
        group: {
          id: groupMembership?.group.id,
        },
      },
    });
    if (groupMemberships.length == 0) return;
    for (const groupMembership of groupMemberships) {
      const notification: NotificationEntity = new NotificationEntity({
        user: groupMembership.card.owner.user,
        group: groupMembership.group,
        title: 'New membership in group',
        description: `Card ${groupMembership.card.firstname} ${groupMembership.card.lastname} has been added to group as ${groupMembership.role}`,
        type: NotificationTypeEnum.JOIN_NEW_GROUP,
      });
      await notificationRepository.save(notification);
    }
  }

  async beforeSoftRemove(event: SoftRemoveEvent<GroupMembershipEntity>): Promise<void> {
    const InsertedGroupMembership: GroupMembershipEntity | undefined = event.entity;
    const notificationRepository: Repository<NotificationEntity> = event.manager.getRepository(NotificationEntity);
    const groupMembershipRepository: Repository<GroupMembershipEntity> =
      event.manager.getRepository(GroupMembershipEntity);
    const groupMembership: GroupMembershipEntity | null = await groupMembershipRepository.findOne({
      relations: ['group'],
      where: {
        id: InsertedGroupMembership?.id,
      },
    });
    const groupMemberships: GroupMembershipEntity[] = await groupMembershipRepository.find({
      relations: ['group', 'card', 'card.owner', 'card.owner.user'],
      where: {
        group: {
          id: groupMembership?.group.id,
        },
      },
    });
    if (groupMemberships.length == 0) return;
    for (const groupMembership of groupMemberships) {
      const notification: NotificationEntity = new NotificationEntity({
        user: groupMembership.card.owner.user,
        group: groupMembership.group,
        title: 'Membership in group has been removed',
        description:
          'Card ' +
          groupMembership.card.firstname +
          ' ' +
          groupMembership.card.lastname +
          ' has been removed from group',
        type: NotificationTypeEnum.LEAVE_GROUP,
      });
      await notificationRepository.save(notification);
    }
  }
}

import { EntitySubscriberInterface, EventSubscriber, InsertEvent, Repository } from 'typeorm';
import { MessageEntity } from '../../../conversation/domain/entities/message.entity';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { GroupMembershipEntity } from '../../../groupe/domain/entities/group-membership.entity';
import { NotificationTypeEnum } from '../../domain/enum/notification-type.enum';

@EventSubscriber()
export class NotificationMessageSubscriber implements EntitySubscriberInterface<MessageEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return MessageEntity;
  }

  async afterInsert(event: InsertEvent<MessageEntity>): Promise<void> {
    const message: MessageEntity | undefined = event.entity;
    const messageRepository: Repository<MessageEntity> = event.manager.getRepository(MessageEntity);
    const notificationRepository: Repository<NotificationEntity> = event.manager.getRepository(NotificationEntity);
    const messageEntity: MessageEntity | null = await messageRepository.findOne({
      relations: ['conversation', 'conversation.group'],
      where: {
        id: message?.id,
      },
    });
    const groupMembershipRepository: Repository<GroupMembershipEntity> =
      event.manager.getRepository(GroupMembershipEntity);
    const groupMembership: GroupMembershipEntity | null = await groupMembershipRepository.findOne({
      relations: ['group'],
      where: {
        id: messageEntity?.conversation.id,
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
        title: 'New Message in group ' + groupMembership.group.name,
        description:
          'Card ' +
          groupMembership.card.firstname +
          ' ' +
          groupMembership.card.lastname +
          ' has sent a message in group ' +
          groupMembership.group.name,
        type: NotificationTypeEnum.NEW_MESSAGE,
      });
      await notificationRepository.save(notification);
    }
  }
}

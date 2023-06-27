import { EntitySubscriberInterface, EventSubscriber, InsertEvent, Repository } from 'typeorm';
import { MessageEntity } from '../../../conversation/domain/entities/message.entity';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { GroupMembershipEntity } from '../../../groupe/domain/entities/group-membership.entity';
import { NotificationTypeEnum } from '../../domain/enum/notification-type.enum';
import { ConnectedCardEntity } from '../../../card/domain/entities/connected-card.entity';

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
      relations: ['conversation', 'conversation.group', 'conversation.connectedCard', 'author'],
      where: {
        id: message?.id,
      },
    });
    if (messageEntity?.conversation.connectedCard) {
      const connectedCardRepository: Repository<ConnectedCardEntity> = event.manager.getRepository(ConnectedCardEntity);
      const connectedCard: ConnectedCardEntity | null = await connectedCardRepository.findOne({
        relations: [
          'cardEntityOne',
          'cardEntityOne.owner',
          'cardEntityOne.owner.user',
          'cardEntityTwo',
          'cardEntityTwo.owner',
          'cardEntityTwo.owner.user',
        ],
        where: {
          id: messageEntity?.conversation.connectedCard.id,
        },
      });
      if (!connectedCard) return;
      const notification: NotificationEntity = new NotificationEntity({
        user:
          connectedCard.cardEntityOne.id === messageEntity?.author.id
            ? connectedCard.cardEntityTwo.owner.user
            : connectedCard.cardEntityOne.owner.user,
        title:
          'New Message from received by ' + connectedCard.cardEntityOne.id === messageEntity?.author.id
            ? connectedCard.cardEntityTwo.owner.usernameProfile
            : connectedCard.cardEntityOne.owner.usernameProfile,
        profile:
          connectedCard.cardEntityOne.id === messageEntity?.author.id
            ? connectedCard.cardEntityTwo.owner
            : connectedCard.cardEntityOne.owner,
        description:
          'New Message from received by ' + connectedCard.cardEntityOne.id === messageEntity?.author.id
            ? connectedCard.cardEntityTwo.owner.usernameProfile
            : connectedCard.cardEntityOne.owner.usernameProfile,
        type: NotificationTypeEnum.NEW_MESSAGE,
      });
      await notificationRepository.save(notification);
      return;
    }
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
          groupMembership.card.owner.usernameProfile +
          ' has sent a message in group ' +
          groupMembership.group.name,
        type: NotificationTypeEnum.NEW_MESSAGE,
      });
      await notificationRepository.save(notification).catch(error => {
        console.log(error);
      });
    }
  }
}

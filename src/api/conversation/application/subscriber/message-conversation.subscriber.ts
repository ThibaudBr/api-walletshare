import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { ConversationEntity } from '../../domain/entities/conversation.entity';
import { MessageEntity } from '../../domain/entities/message.entity';

@EventSubscriber()
export class MessageConversationSubscriber implements EntitySubscriberInterface<ConversationEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return ConversationEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<ConversationEntity>): Promise<void> {
    const removedConversation: ConversationEntity | undefined = event.entity;
    const messageRepository: Repository<MessageEntity> = event.manager.getRepository(MessageEntity);
    const messages: MessageEntity[] = await messageRepository.find({
      relations: ['conversation'],
      where: {
        conversation: {
          id: removedConversation?.id,
        },
      },
    });
    if (messages.length == 0) return;
    await messageRepository.softRemove(messages).catch(error => {
      console.log(error);
    });
  }

  async beforeRemove(event: RemoveEvent<ConversationEntity>): Promise<void> {
    const removedConversation: ConversationEntity | undefined = event.entity;
    const messageRepository: Repository<MessageEntity> = event.manager.getRepository(MessageEntity);
    const messages: MessageEntity[] = await messageRepository.find({
      relations: ['conversation'],
      withDeleted: true,
      where: {
        conversation: {
          id: removedConversation?.id,
        },
      },
    });
    if (messages.length == 0) return;
    await messageRepository.remove(messages).catch(error => {
      console.log(error);
    });
  }
}

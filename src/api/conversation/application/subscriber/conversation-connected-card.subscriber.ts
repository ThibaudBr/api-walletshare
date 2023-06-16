import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, SoftRemoveEvent } from 'typeorm';
import { ConnectedCardEntity } from '../../../card/domain/entities/connected-card.entity';
import { ConversationEntity } from '../../domain/entities/conversation.entity';

@EventSubscriber()
export class ConversationConnectedCardSubscriber implements EntitySubscriberInterface<ConnectedCardEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return ConnectedCardEntity;
  }

  async afterInsert(event: InsertEvent<ConnectedCardEntity>): Promise<void> {
    const connectedCard: ConnectedCardEntity | undefined = event.entity;
    const conversationRepository = event.manager.getRepository(ConversationEntity);
    const conversation: ConversationEntity = new ConversationEntity({
      connectedCard: connectedCard,
    });
    await conversationRepository.save(conversation);
  }

  async beforeSoftRemove(event: SoftRemoveEvent<ConnectedCardEntity>): Promise<void> {
    const softRemovedConnectedCard: ConnectedCardEntity | undefined = event.entity;
    const conversationRepository = event.manager.getRepository(ConversationEntity);
    const conversations: ConversationEntity[] = await conversationRepository.find({
      relations: ['connectedCard'],
      where: {
        connectedCard: {
          id: softRemovedConnectedCard?.id,
        },
      },
    });
    if (conversations.length == 0) return;
    await conversationRepository.softRemove(conversations);
  }

  async beforeRemove(event: RemoveEvent<ConnectedCardEntity>): Promise<void> {
    const softRemovedConnectedCard: ConnectedCardEntity | undefined = event.entity;
    const conversationRepository = event.manager.getRepository(ConversationEntity);
    const conversations: ConversationEntity[] = await conversationRepository.find({
      relations: ['connectedCard'],
      withDeleted: true,
      where: {
        connectedCard: {
          id: softRemovedConnectedCard?.id,
        },
      },
    });
    if (conversations.length == 0) return;
    await event.manager
      .getRepository(ConversationEntity)
      .remove(conversations)
      .catch(async err => {
        throw new Error('An error occurred while removing conversation');
      });
  }
}

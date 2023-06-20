import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { ConversationEntity } from '../../domain/entities/conversation.entity';
import { JoinedConversationEntity } from '../../domain/entities/joined-conversation.entity';

@EventSubscriber()
export class JoinedConversationGroupSubscriber implements EntitySubscriberInterface<ConversationEntity> {
  listenTo(): typeof ConversationEntity {
    return ConversationEntity;
  }

  async beforeRemove(event: RemoveEvent<ConversationEntity>): Promise<void> {
    const conversation: ConversationEntity | undefined = event.entity;
    const conversationRepository: Repository<ConversationEntity> = event.manager.getRepository(ConversationEntity);
    const joinedConversationRepository: Repository<JoinedConversationEntity> =
      event.manager.getRepository(JoinedConversationEntity);
    const conversationGroup: ConversationEntity | null = await conversationRepository.findOne({
      relations: ['joinedProfiles'],
      withDeleted: true,
      where: {
        id: conversation?.id,
      },
    });
    if (conversationGroup == null) return;
    await joinedConversationRepository.remove(conversationGroup.joinedProfiles);
  }

  async beforeSoftRemove(event: SoftRemoveEvent<ConversationEntity>): Promise<void> {
    const conversation: ConversationEntity | undefined = event.entity;
    const conversationRepository: Repository<ConversationEntity> = event.manager.getRepository(ConversationEntity);
    const joinedConversationRepository: Repository<JoinedConversationEntity> =
      event.manager.getRepository(JoinedConversationEntity);
    const conversationGroup: ConversationEntity | null = await conversationRepository.findOne({
      relations: ['joinedProfiles'],
      where: {
        id: conversation?.id,
      },
    });
    if (conversationGroup == null) return;
    await joinedConversationRepository.remove(conversationGroup.joinedProfiles);
  }
}

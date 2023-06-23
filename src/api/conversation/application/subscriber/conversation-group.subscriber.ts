import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  Repository,
  SoftRemoveEvent,
} from 'typeorm';
import { ConversationEntity } from '../../domain/entities/conversation.entity';
import { GroupEntity } from '../../../groupe/domain/entities/group.entity';

@EventSubscriber()
export class ConversationGroupSubscriber implements EntitySubscriberInterface<GroupEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return GroupEntity;
  }

  async afterInsert(event: InsertEvent<GroupEntity>): Promise<void> {
    const insertedGroup: GroupEntity | undefined = event.entity;
    const conversationRepository: Repository<ConversationEntity> = event.manager.getRepository(ConversationEntity);
    const conversation: ConversationEntity = new ConversationEntity({
      group: insertedGroup,
    });
    await conversationRepository.save(conversation);
  }

  async beforeSoftRemove(event: SoftRemoveEvent<GroupEntity>): Promise<void> {
    const softRemovedGroup: GroupEntity | undefined = event.entity;
    const conversationRepository: Repository<ConversationEntity> = event.manager.getRepository(ConversationEntity);
    const conversations: ConversationEntity[] = await conversationRepository.find({
      relations: ['group'],
      where: {
        group: {
          id: softRemovedGroup?.id,
        },
      },
    });
    if (conversations.length == 0) return;
    await conversationRepository.softRemove(conversations).catch(error => {
      console.log(error);
    });
  }

  async beforeRemove(event: RemoveEvent<GroupEntity>): Promise<void> {
    const softRemovedGroup: GroupEntity | undefined = event.entity;
    const conversationRepository: Repository<ConversationEntity> = event.manager.getRepository(ConversationEntity);
    const conversations: ConversationEntity[] = await conversationRepository.find({
      relations: ['group'],
      withDeleted: true,
      where: {
        group: {
          id: softRemovedGroup?.id,
        },
      },
    });
    if (conversations.length == 0) return;
    await conversationRepository.remove(conversations).catch(error => {
      console.log(error);
    });
  }
}

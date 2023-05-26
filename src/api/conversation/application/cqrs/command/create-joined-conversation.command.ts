import { ProfileEntity } from '../../../../profile/domain/entities/profile.entity';
import { ConversationEntity } from '../../../domain/entities/conversation.entity';

export class CreateJoinedConversationCommand {
  public readonly userId: string;
  public readonly profileEntity: ProfileEntity;
  public readonly cardId?: string;
  public readonly conversationEntity: ConversationEntity;

  constructor(partial: Partial<CreateJoinedConversationCommand>) {
    Object.assign(this, partial);
  }
}

import { ProfileEntity } from '../../../../profile/domain/entities/profile.entity';
import { ConversationEntity } from '../../../domain/entities/conversation.entity';

export class CreateJoinedConversationCommand {
  public readonly socketId: string;
  public readonly userId: string;
  public readonly profileEntity: ProfileEntity;
  public readonly conversationEntity: ConversationEntity;

  constructor(partial: Partial<CreateJoinedConversationCommand>) {
    Object.assign(this, partial);
  }
}

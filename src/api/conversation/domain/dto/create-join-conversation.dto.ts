import { ConversationEntity } from '../entities/conversation.entity';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';

export class CreateJoinConversationDto {
  public readonly userId: string;
  public readonly profileEntity: ProfileEntity;
  public readonly cardId?: string;
  public readonly conversationEntity: ConversationEntity;

  constructor(partial: Partial<CreateJoinConversationDto>) {
    Object.assign(this, partial);
  }
}

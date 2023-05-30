import { GroupResponse } from '../../../groupe/web/response/group.response';
import { MessageResponse } from './message.response';
import { ConnectedCardResponse } from '../../../card/web/response/connected-card.response';
import { JoinedConversationResponse } from './joined-conversation.response';

export class ConversationResponse {
  public readonly id: string;
  public readonly content: string;
  public readonly connectedCard?: ConnectedCardResponse;
  public readonly group?: GroupResponse;
  public readonly messages?: MessageResponse[];
  public readonly joinedProfiles?: JoinedConversationResponse[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  constructor(partial: Partial<ConversationResponse>) {
    Object.assign(this, partial);
  }
}

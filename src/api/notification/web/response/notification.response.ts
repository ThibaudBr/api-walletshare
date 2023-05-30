import { NotificationTypeEnum } from '../../domain/enum/notification-type.enum';
import { ConversationResponse } from '../../../conversation/web/response/conversation.response';

export class NotificationResponse {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public readonly type: NotificationTypeEnum;
  public readonly isRead: boolean;
  public readonly link: string;
  public readonly conversation?: ConversationResponse;

  constructor(partial: Partial<NotificationResponse>) {
    Object.assign(this, partial);
  }
}

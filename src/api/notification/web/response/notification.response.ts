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
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  constructor(partial: Partial<NotificationResponse>) {
    Object.assign(this, partial);
  }
}

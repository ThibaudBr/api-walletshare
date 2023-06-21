import { CardResponse } from '../../../card/web/response/card.response';

export class ReceiveMessageResponse {
  id: string;
  content: string;
  conversationId: string;
  author: CardResponse;
  createdAt: Date;

  constructor(partial: Partial<ReceiveMessageResponse>) {
    Object.assign(this, partial);
  }
}

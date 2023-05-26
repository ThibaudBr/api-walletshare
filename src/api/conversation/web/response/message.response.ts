import { CardResponse } from '../../../card/web/response/card.response';

export class MessageResponse {
  public readonly id: string;
  public readonly content: string;
  public readonly author: CardResponse;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  constructor(partial: Partial<MessageResponse>) {
    Object.assign(this, partial);
  }
}

import { CardResponse } from '../../../card/web/response/card.response';

export class ReceiveMessageResponse {
  constructor(partial: Partial<ReceiveMessageResponse>) {
    Object.assign(this, partial);
  }

  public readonly content: string;
  public readonly author: CardResponse;
}

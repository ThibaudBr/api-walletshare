import { CardResponse } from '../../../card/web/response/card.response';

export class ReceiveMessageResponse {
  public readonly content: string;
  public readonly author: CardResponse;

  constructor(partial: Partial<ReceiveMessageResponse>) {
    Object.assign(this, partial);
  }
}

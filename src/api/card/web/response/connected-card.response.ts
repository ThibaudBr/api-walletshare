import { CardResponse } from './card.response';

export class ConnectedCardResponse {
  public readonly id: string;
  public readonly cardEntityOne: CardResponse;
  public readonly cardEntityTwo: CardResponse;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  constructor(partial: Partial<ConnectedCardResponse>) {
    Object.assign(this, partial);
  }
}

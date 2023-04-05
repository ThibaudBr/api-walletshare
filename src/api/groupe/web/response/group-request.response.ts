import { CardResponse } from '../../../card/web/response/card.response';
import { GroupResponse } from './group.response';

export class GroupRequestResponse {
  constructor(partial: Partial<GroupRequestResponse>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly groupId?: string;
  public readonly group: GroupResponse;
  public readonly cardId?: string;
  public readonly card?: CardResponse;
  public readonly status: string;
  public readonly createdAt: Date;
  public readonly deleteAt?: Date;
}

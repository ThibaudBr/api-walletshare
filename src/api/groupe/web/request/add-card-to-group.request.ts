export class AddCardToGroupRequest {
  constructor(partial: Partial<AddCardToGroupRequest>) {
    Object.assign(this, partial);
  }

  groupId: string;

  cardIdList: string[];
}

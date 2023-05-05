export class AddCardToGroupRequest {
  groupId: string;
  cardIdList: string[];

  constructor(partial: Partial<AddCardToGroupRequest>) {
    Object.assign(this, partial);
  }
}

export class AddCardToGroupCommand {
  constructor(partial: Partial<AddCardToGroupCommand>) {
    Object.assign(this, partial);
  }

  cardId: string;
  groupId: string;
}

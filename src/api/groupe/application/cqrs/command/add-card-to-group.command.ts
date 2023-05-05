export class AddCardToGroupCommand {
  cardId: string;
  groupId: string;

  constructor(partial: Partial<AddCardToGroupCommand>) {
    Object.assign(this, partial);
  }
}

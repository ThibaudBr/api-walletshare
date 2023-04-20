export class AddCardToGroupEvent {
  constructor(partial: Partial<AddCardToGroupEvent>) {
    Object.assign(this, partial);
  }

  public readonly groupId: string;
  public readonly cardId: string;
  public readonly module: string = 'group';
  public readonly method: string = 'add-card-to-group';
}

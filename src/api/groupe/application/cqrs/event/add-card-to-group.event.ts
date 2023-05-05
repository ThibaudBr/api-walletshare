export class AddCardToGroupEvent {
  public readonly groupId: string;
  public readonly cardId: string;
  public readonly module: string = 'group';
  public readonly method: string = 'add-card-to-group';

  constructor(partial: Partial<AddCardToGroupEvent>) {
    Object.assign(this, partial);
  }
}

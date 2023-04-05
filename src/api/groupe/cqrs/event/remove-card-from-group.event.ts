export class RemoveCardFromGroupEvent {
  constructor(partial: Partial<RemoveCardFromGroupEvent>) {
    Object.assign(this, partial);
  }

  public readonly module: string = 'group';
  public readonly method: string = 'remove-card-from-group';
  public readonly cardId: string;
  public readonly groupId: string;
}

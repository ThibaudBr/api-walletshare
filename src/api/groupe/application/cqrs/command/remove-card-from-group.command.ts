export class RemoveCardFromGroupCommand {
  public readonly cardId: string;
  public readonly groupId: string;

  constructor(partial: Partial<RemoveCardFromGroupCommand>) {
    Object.assign(this, partial);
  }
}

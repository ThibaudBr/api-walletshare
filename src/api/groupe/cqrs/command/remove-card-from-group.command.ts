export class RemoveCardFromGroupCommand {
  constructor(partial: Partial<RemoveCardFromGroupCommand>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly groupId: string;
}

export class RemoveCardFromGroupRequest {
  constructor(partial: Partial<RemoveCardFromGroupRequest>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly groupId: string;
}

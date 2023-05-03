export class RemoveCardFromGroupRequest {
  public readonly cardId: string;
  public readonly groupId: string;

  constructor(partial: Partial<RemoveCardFromGroupRequest>) {
    Object.assign(this, partial);
  }
}

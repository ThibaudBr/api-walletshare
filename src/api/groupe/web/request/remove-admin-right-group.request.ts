export class RemoveAdminRightGroupRequest {
  public readonly cardId: string;
  public readonly groupId: string;

  constructor(partial: Partial<RemoveAdminRightGroupRequest>) {
    Object.assign(this, partial);
  }
}

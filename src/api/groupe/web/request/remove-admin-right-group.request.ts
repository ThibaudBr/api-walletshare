export class RemoveAdminRightGroupRequest {
  constructor(partial: Partial<RemoveAdminRightGroupRequest>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly groupId: string;
}

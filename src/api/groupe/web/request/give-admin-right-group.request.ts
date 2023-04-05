export class GiveAdminRightGroupRequest {
  constructor(partial: Partial<GiveAdminRightGroupRequest>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly groupId: string;
}

export class GiveAdminRightGroupRequest {
  public readonly cardId: string;
  public readonly groupId: string;

  constructor(partial: Partial<GiveAdminRightGroupRequest>) {
    Object.assign(this, partial);
  }
}

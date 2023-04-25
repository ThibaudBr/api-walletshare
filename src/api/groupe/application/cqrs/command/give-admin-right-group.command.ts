export class GiveAdminRightGroupCommand {
  constructor(partial: Partial<GiveAdminRightGroupCommand>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly groupId: string;
}

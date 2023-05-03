export class GiveAdminRightGroupCommand {
  public readonly cardId: string;
  public readonly groupId: string;

  constructor(partial: Partial<GiveAdminRightGroupCommand>) {
    Object.assign(this, partial);
  }
}

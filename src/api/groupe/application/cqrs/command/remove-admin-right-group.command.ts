export class RemoveAdminRightGroupCommand {
  constructor(partial: Partial<RemoveAdminRightGroupCommand>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly groupId: string;
}

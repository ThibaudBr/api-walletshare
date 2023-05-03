export class RemoveAdminRightGroupCommand {
  public readonly cardId: string;
  public readonly groupId: string;

  constructor(partial: Partial<RemoveAdminRightGroupCommand>) {
    Object.assign(this, partial);
  }
}

export class RemoveAdminRightGroupEvent {
  constructor(partial: Partial<RemoveAdminRightGroupEvent>) {
    Object.assign(this, partial);
  }

  public readonly module: string = 'group';
  public readonly method: string = 'accept-group-request';
  public readonly cardId: string;
  public readonly groupId: string;
}

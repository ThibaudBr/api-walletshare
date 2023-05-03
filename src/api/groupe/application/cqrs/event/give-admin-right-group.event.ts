export class GiveAdminRightGroupEvent {
  public readonly module: string = 'group';
  public readonly method: string = 'accept-group-request';
  public readonly cardId: string;
  public readonly groupId: string;

  constructor(partial: Partial<GiveAdminRightGroupEvent>) {
    Object.assign(this, partial);
  }
}

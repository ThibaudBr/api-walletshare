export class CancelGroupRequestEvent {
  constructor(partial: Partial<CancelGroupRequestEvent>) {
    Object.assign(this, partial);
  }

  public readonly module: string = 'group';
  public readonly method: string = 'accept-group-request';
  public readonly cardId: string;
  public readonly groupId: string;
}

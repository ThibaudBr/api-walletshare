export class AcceptGroupRequestEvent {
  constructor(partial: Partial<AcceptGroupRequestEvent>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly groupId: string;
  public readonly module: string = 'group';
  public readonly method: string = 'accept-group-request';
}

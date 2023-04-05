export class SendGroupRequestEvent {
  constructor(partial: Partial<SendGroupRequestEvent>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly groupId: string;
  public readonly module: string = 'group';
  public readonly method: string = 'send-group-request';
}

export class SendGroupRequestCommand {
  constructor(partial: Partial<SendGroupRequestCommand>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly groupId: string;
}

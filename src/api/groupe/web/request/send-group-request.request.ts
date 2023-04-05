export class SendGroupRequestRequest {
  constructor(partial: Partial<SendGroupRequestRequest>) {
    Object.assign(this, partial);
  }

  public readonly groupId: string;
  public readonly cardId: string;
}

export class AcceptGroupRequestRequest {
  constructor(partial: Partial<AcceptGroupRequestRequest>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly groupId: string;
}

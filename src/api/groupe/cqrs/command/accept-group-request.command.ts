export class AcceptGroupRequestCommand {
  constructor(partial: Partial<AcceptGroupRequestCommand>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly groupId: string;
}

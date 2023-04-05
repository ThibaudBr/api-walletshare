export class CreateGroupRequest {
  constructor(partial: Partial<CreateGroupRequest>) {
    Object.assign(this, partial);
  }

  public readonly name: string;
  public readonly cardId: string;
}

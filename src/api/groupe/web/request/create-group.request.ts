export class CreateGroupRequest {
  public readonly name: string;
  public readonly cardId: string;

  constructor(partial: Partial<CreateGroupRequest>) {
    Object.assign(this, partial);
  }
}

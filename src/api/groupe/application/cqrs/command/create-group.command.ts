export class CreateGroupCommand {
  public readonly name: string;
  public readonly cardId: string;

  constructor(partial: Partial<CreateGroupCommand>) {
    Object.assign(this, partial);
  }
}

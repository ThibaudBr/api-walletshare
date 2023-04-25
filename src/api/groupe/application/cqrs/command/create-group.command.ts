export class CreateGroupCommand {
  constructor(partial: Partial<CreateGroupCommand>) {
    Object.assign(this, partial);
  }

  public readonly name: string;
  public readonly cardId: string;
}

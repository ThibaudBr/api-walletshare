export class DeleteGroupCommand {
  constructor(partial: Partial<DeleteGroupCommand>) {
    Object.assign(this, partial);
  }

  public readonly groupId: string;
}

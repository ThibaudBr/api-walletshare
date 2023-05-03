export class DeleteGroupCommand {
  public readonly groupId: string;

  constructor(partial: Partial<DeleteGroupCommand>) {
    Object.assign(this, partial);
  }
}

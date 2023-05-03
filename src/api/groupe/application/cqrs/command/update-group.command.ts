export class UpdateGroupCommand {
  public readonly groupId: string;
  public readonly name: string;

  constructor(partial: Partial<UpdateGroupCommand>) {
    Object.assign(this, partial);
  }
}

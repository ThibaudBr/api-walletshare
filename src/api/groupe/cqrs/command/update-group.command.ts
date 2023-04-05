export class UpdateGroupCommand {
  constructor(partial: Partial<UpdateGroupCommand>) {
    Object.assign(this, partial);
  }

  public readonly groupId: string;
  public readonly name: string;
}

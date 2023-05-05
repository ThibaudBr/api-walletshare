export class RestoreGroupCommand {
  public readonly groupId: string;

  constructor(partial: Partial<RestoreGroupCommand>) {
    Object.assign(this, partial);
  }
}

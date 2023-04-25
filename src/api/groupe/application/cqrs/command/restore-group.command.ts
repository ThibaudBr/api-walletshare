export class RestoreGroupCommand {
  constructor(partial: Partial<RestoreGroupCommand>) {
    Object.assign(this, partial);
  }

  public readonly groupId: string;
}

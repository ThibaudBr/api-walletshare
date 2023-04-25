export class SoftDeleteGroupCommand {
  constructor(partial: Partial<SoftDeleteGroupCommand>) {
    Object.assign(this, partial);
  }

  public readonly groupId: string;
}

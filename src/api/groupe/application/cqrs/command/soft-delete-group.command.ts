export class SoftDeleteGroupCommand {
  public readonly groupId: string;

  constructor(partial: Partial<SoftDeleteGroupCommand>) {
    Object.assign(this, partial);
  }
}

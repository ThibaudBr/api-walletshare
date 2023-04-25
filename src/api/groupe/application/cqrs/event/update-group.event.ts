export class UpdateGroupEvent {
  constructor(partial: Partial<UpdateGroupEvent>) {
    Object.assign(this, partial);
  }

  public readonly groupId: string;
  public readonly module: string = 'group';
  public readonly method: string = 'update-group';
}

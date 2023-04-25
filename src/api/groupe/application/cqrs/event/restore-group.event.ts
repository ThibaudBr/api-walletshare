export class RestoreGroupEvent {
  constructor(partial: Partial<RestoreGroupEvent>) {
    Object.assign(this, partial);
  }

  public readonly groupId: string;
  public readonly module: string = 'group';
  public readonly method: string = 'update-group';
}

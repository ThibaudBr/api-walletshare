export class RestoreGroupEvent {
  public readonly groupId: string;
  public readonly module: string = 'group';
  public readonly method: string = 'update-group';

  constructor(partial: Partial<RestoreGroupEvent>) {
    Object.assign(this, partial);
  }
}

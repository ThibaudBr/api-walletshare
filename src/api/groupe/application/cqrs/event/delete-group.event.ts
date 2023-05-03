export class DeleteGroupEvent {
  public readonly groupId: string;
  public readonly module: string = 'group';
  public readonly method: string = 'delete-group';

  constructor(partial: Partial<DeleteGroupEvent>) {
    Object.assign(this, partial);
  }
}

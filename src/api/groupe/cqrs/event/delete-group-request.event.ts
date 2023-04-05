export class DeleteGroupRequestEvent {
  constructor(partial: Partial<DeleteGroupRequestEvent>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly module: string = 'group';
  public readonly method: string = 'delete-group-request';
}

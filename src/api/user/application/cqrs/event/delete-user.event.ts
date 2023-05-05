export class DeleteUserEvent {
  public readonly module: string = 'user';
  public readonly method: string = 'delete-user';

  constructor(public readonly userId: string) {}
}

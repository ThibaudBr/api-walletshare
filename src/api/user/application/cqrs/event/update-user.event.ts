export class UpdateUserEvent {
  public readonly module: string = 'user';
  public readonly method: string = 'update-user';

  constructor(public readonly userId: string) {}
}

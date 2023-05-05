export class RestoreUserEvent {
  public readonly module: string = 'user';
  public readonly method: string = 'restore-user';

  constructor(public readonly userId: string) {}
}

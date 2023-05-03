export class SoftDeleteUserEvent {
  public readonly module: string = 'user';
  public readonly method: string = 'set-refresh-token-user';

  constructor(public readonly userId: string) {}
}

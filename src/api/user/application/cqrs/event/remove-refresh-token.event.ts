export class RemoveRefreshTokenEvent {
  public readonly module: string = 'user';
  public readonly method: string = 'remove-refresh-token';

  constructor(public readonly userId: string) {}
}

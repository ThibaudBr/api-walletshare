export class LoginOfUserEvent {
  public readonly module: string = 'user';
  public readonly method: string = 'login-user';

  constructor(public readonly username: string) {}
}

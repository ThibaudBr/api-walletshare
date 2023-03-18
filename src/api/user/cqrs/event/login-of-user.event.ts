export class LoginOfUserEvent {
  constructor(
    public readonly username: string,
    public readonly module: string = 'user',
    public readonly method: string = 'login-user',
  ) {}
}

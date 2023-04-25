export class UpdateUserCredentialEvent {
  public readonly module: string = 'user';
  public readonly method: string = 'update-user-credential';
  constructor(public readonly userId: string) {}
}

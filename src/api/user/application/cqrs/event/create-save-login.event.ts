export class CreateSaveLoginEvent {
  constructor(partial: Partial<CreateSaveLoginEvent>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public readonly module: string = 'user';
  public readonly method: string = 'create-save-login-user';
}

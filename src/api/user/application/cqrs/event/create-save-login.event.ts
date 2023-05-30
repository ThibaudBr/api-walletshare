export class CreateSaveLoginEvent {
  public readonly userId: string;
  public readonly module: string = 'user';
  public readonly method: string = 'create-save-login-user';

  constructor(partial: Partial<CreateSaveLoginEvent>) {
    Object.assign(this, partial);
  }
}

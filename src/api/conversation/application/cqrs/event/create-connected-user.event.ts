export class CreateConnectedUserEvent {
  constructor(partial: Partial<CreateConnectedUserEvent>) {
    Object.assign(this, partial);
  }

  public readonly socketId: string;
  public readonly userId: string;
  public readonly method: string = 'create-connected-user';
  public readonly module: string = 'conversation';
}

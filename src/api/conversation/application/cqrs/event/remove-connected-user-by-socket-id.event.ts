export class RemoveConnectedUserBySocketIdEvent {
  constructor(partial: Partial<RemoveConnectedUserBySocketIdEvent>) {
    Object.assign(this, partial);
  }

  public readonly socketId: string;
  public readonly method: string = 'remove-connected-user';
  public readonly module: string = 'conversation';
}

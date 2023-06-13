export class RemoveConnectedUserBySocketIdEvent {
  public readonly socketId: string;
  public readonly method: string = 'remove-connected-user';
  public readonly module: string = 'conversation';

  constructor(partial: Partial<RemoveConnectedUserBySocketIdEvent>) {
    Object.assign(this, partial);
  }
}

export class RemoveAllConnectedUserEvent {
  constructor(partial: Partial<RemoveAllConnectedUserEvent>) {
    Object.assign(this, partial);
  }

  public readonly method: string = 'remove-all-connected-user';
  public readonly module: string = 'conversation';
}

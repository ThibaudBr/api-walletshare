export class RemoveAllConnectedUserEvent {
  public readonly method: string = 'remove-all-connected-user';
  public readonly module: string = 'conversation';

  constructor(partial: Partial<RemoveAllConnectedUserEvent>) {
    Object.assign(this, partial);
  }
}

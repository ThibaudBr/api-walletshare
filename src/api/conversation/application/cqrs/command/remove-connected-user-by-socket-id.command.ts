export class RemoveConnectedUserBySocketIdCommand {
  public readonly socketId: string;

  constructor(partial: Partial<RemoveConnectedUserBySocketIdCommand>) {
    Object.assign(this, partial);
  }
}

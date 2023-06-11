export class RemoveConnectedUserBySocketIdCommand {
  constructor(partial: Partial<RemoveConnectedUserBySocketIdCommand>) {
    Object.assign(this, partial);
  }

  public readonly socketId: string;
}

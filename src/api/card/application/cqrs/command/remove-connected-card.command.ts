export class RemoveConnectedCardCommand {
  constructor(partial: Partial<RemoveConnectedCardCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly connectedCardId: string;
}

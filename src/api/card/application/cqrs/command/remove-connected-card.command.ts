export class RemoveConnectedCardCommand {
  public readonly id: string;
  public readonly connectedCardId: string;

  constructor(partial: Partial<RemoveConnectedCardCommand>) {
    Object.assign(this, partial);
  }
}

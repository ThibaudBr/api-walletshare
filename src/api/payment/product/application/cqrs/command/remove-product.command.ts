export class RemoveProductCommand {
  public readonly id: string;

  constructor(partial: Partial<RemoveProductCommand>) {
    Object.assign(this, partial);
  }
}

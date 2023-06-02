export class RemoveProductCommand {
  constructor(partial: Partial<RemoveProductCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}

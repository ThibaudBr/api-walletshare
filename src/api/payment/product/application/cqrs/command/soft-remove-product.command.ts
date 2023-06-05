export class SoftRemoveProductCommand {
  public readonly id: string;

  constructor(partial: Partial<SoftRemoveProductCommand>) {
    Object.assign(this, partial);
  }
}

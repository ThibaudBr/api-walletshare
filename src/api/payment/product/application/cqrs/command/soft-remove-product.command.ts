export class SoftRemoveProductCommand {
  constructor(partial: Partial<SoftRemoveProductCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}

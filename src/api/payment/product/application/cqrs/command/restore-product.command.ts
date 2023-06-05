export class RestoreProductCommand {
  public readonly id: string;

  constructor(partial: Partial<RestoreProductCommand>) {
    Object.assign(this, partial);
  }
}

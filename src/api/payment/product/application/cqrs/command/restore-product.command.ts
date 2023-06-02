export class RestoreProductCommand {
  constructor(partial: Partial<RestoreProductCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}

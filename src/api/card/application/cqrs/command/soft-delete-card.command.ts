export class SoftDeleteCardCommand {
  public readonly id: string;

  constructor(partial: Partial<SoftDeleteCardCommand>) {
    Object.assign(this, partial);
  }
}

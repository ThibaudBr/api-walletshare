export class SoftDeleteCardCommand {
  constructor(partial: Partial<SoftDeleteCardCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
}

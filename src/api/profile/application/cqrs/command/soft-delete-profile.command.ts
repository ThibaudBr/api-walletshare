export class SoftDeleteProfileCommand {
  public readonly id: string;

  constructor(partial: Partial<SoftDeleteProfileCommand>) {
    Object.assign(this, partial);
  }
}

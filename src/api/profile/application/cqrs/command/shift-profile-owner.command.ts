export class ShiftProfileOwnerCommand {
  public readonly profileId: string;
  public readonly userId: string;

  constructor(partial: Partial<ShiftProfileOwnerCommand>) {
    Object.assign(this, partial);
  }
}

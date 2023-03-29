export class ShiftProfileOwnerRequest {
  public readonly profileId: string;
  public readonly userId: string;

  constructor(partial: Partial<ShiftProfileOwnerRequest>) {
    Object.assign(this, partial);
  }
}

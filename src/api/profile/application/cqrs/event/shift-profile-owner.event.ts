export class ShiftProfileOwnerEvent {
  public readonly id: string;
  public readonly owner: string;

  public readonly module: string = 'profile';
  public readonly method: string = 'shift-profile-owner';

  constructor(partial: Partial<ShiftProfileOwnerEvent>) {
    Object.assign(this, partial);
  }
}

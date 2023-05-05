export class SoftDeleteProfileEvent {
  public readonly id: string;
  public readonly module: string = 'profile';
  public readonly method: string = 'soft-delete-profile';

  constructor(partial: Partial<SoftDeleteProfileEvent>) {
    Object.assign(this, partial);
  }
}

export class RestoreProfileEvent {
  constructor(partial: Partial<RestoreProfileEvent>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;

  public readonly module: string = 'profile';
  public readonly method: string = 'restore-profile';
}

export class AddAvatarProfileEvent {
  constructor(partial: Partial<AddAvatarProfileEvent>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'add-avatar-profile';
}

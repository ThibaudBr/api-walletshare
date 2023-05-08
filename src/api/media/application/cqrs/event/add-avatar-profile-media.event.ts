export class AddAvatarProfileMediaEvent {
  public readonly profileId: string;
  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'add-avatar-profile';

  constructor(partial: Partial<AddAvatarProfileMediaEvent>) {
    Object.assign(this, partial);
  }
}

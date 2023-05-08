export class AddAvatarGroupMediaEvent {
  public readonly groupId: string;
  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'add-avatar-group-media';

  constructor(partial: Partial<AddAvatarGroupMediaEvent>) {
    Object.assign(this, partial);
  }
}

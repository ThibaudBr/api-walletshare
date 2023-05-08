export class AddBannerProfileMediaEvent {
  public readonly profileId: string;
  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'add-banner-profile-media';

  constructor(partial: Partial<AddBannerProfileMediaEvent>) {
    Object.assign(this, partial);
  }
}

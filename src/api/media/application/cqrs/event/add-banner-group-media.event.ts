export class AddBannerGroupMediaEvent {
  public readonly groupId: string;
  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'add-banner-group-media';

  constructor(partial: Partial<AddBannerGroupMediaEvent>) {
    Object.assign(this, partial);
  }
}

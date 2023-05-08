export class AddBannerCompanyMediaEvent {
  public readonly companyId: string;
  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'add-banner-company-media';

  constructor(partial: Partial<AddBannerCompanyMediaEvent>) {
    Object.assign(this, partial);
  }
}

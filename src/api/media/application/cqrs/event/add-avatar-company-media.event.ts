export class AddAvatarCompanyMediaEvent {
  public readonly companyId: string;
  public readonly mediaId: string;
  public readonly module: string = 'media';
  public readonly method: string = 'add-avatar-company-media';

  constructor(partial: Partial<AddAvatarCompanyMediaEvent>) {
    Object.assign(this, partial);
  }
}

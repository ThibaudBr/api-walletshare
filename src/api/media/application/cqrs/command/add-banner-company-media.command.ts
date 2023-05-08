import { MediaEntity } from '../../../domain/entities/media.entity';

export class AddBannerCompanyMediaCommand {
  public readonly companyId: string;
  public readonly mediaEntity: MediaEntity;

  constructor(partial: Partial<AddBannerCompanyMediaCommand>) {
    Object.assign(this, partial);
  }
}

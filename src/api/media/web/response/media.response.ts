import { GroupResponse } from '../../../groupe/web/response/group.response';
import { CompanyResponse } from '../../../company/web/response/company.response';
import { ProfileResponse } from '../../../profile/web/response/profile.response';
import { CardResponse } from '../../../card/web/response/card.response';

export class MediaResponse {
  public readonly id: string;
  public url?: string;
  public readonly key: string;
  public readonly avatarGroupMedia?: GroupResponse;
  public readonly bannerGroupMedia?: GroupResponse;
  public readonly avatarProfileMedia?: ProfileResponse;
  public readonly bannerProfileMedia?: ProfileResponse;
  public readonly cardMedia?: CardResponse;
  public readonly avatarCompanyMedia?: CompanyResponse;
  public readonly bannerCompanyMedia?: CompanyResponse;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  constructor(partial: Partial<MediaResponse>) {
    Object.assign(this, partial);
  }
}

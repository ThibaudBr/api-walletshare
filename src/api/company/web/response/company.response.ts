import { AddressResponse } from '../../../address/web/response/address.response';
import { OccupationResponse } from '../../../occupation/web/response/occupation-response';
import { ProfileResponse } from '../../../profile/web/response/profile.response';
import { CompanyEmployeeResponse } from './company-employee.response';
import { MediaEntity } from '../../../media/domain/entities/media.entity';

export class CompanyResponse {
  public readonly id: string;
  public readonly name?: string;
  public readonly description?: string;
  public readonly address?: AddressResponse[];
  public readonly website?: string;
  public readonly phone?: string;
  public readonly email?: string;
  public readonly employees?: CompanyEmployeeResponse[];
  public readonly occupations?: OccupationResponse[];
  public readonly ownerProfile?: ProfileResponse;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
  public readonly bannerMedia?: MediaEntity;
  public readonly avatarMedia?: MediaEntity;

  constructor(partial: Partial<CompanyResponse>) {
    Object.assign(this, partial);
  }
}

import { AddressResponse } from '../../../address/web/response/address.response';
import { OccupationResponse } from '../../../occupation/web/response/occupation-response';
import { ProfileResponse } from '../../../profile/web/response/profile.response';
import { CompanyEmployeeResponse } from './company-employee.response';

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

  constructor(partial: Partial<CompanyResponse>) {
    Object.assign(this, partial);
  }
}

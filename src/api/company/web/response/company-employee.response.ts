import { ProfileResponse } from '../../../profile/web/response/profile.response';
import { CompanyResponse } from './company.response';
import { RoleCompanyEmployeeEnum } from '../../domain/enum/role-company-employee.enum';

export class CompanyEmployeeResponse {
  public readonly id: string;
  public readonly roles: RoleCompanyEmployeeEnum[];
  public readonly profile?: ProfileResponse;
  public readonly company?: CompanyResponse;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  constructor(partial: Partial<CompanyEmployeeResponse>) {
    Object.assign(this, partial);
  }
}

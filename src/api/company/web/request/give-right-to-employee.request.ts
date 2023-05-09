import { RoleCompanyEmployeeEnum } from '../../domain/enum/role-company-employee.enum';

export class GiveRightToEmployeeRequest {
  public readonly companyId: string;
  public readonly profileId: string;
  public readonly roles: RoleCompanyEmployeeEnum[];

  constructor(partial: Partial<GiveRightToEmployeeRequest>) {
    Object.assign(this, partial);
  }
}

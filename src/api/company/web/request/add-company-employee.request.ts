import { RoleCompanyEmployeeEnum } from '../../domain/enum/role-company-employee.enum';

export class AddCompanyEmployeeRequest {
  public readonly companyId: string;
  public readonly profileId: string;
  public readonly roles: RoleCompanyEmployeeEnum[];

  constructor(partial: Partial<AddCompanyEmployeeRequest>) {
    Object.assign(this, partial);
  }
}

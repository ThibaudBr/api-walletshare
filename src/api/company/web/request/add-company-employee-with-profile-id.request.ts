import { RoleCompanyEmployeeEnum } from '../../domain/enum/role-company-employee.enum';

export class AddCompanyEmployeeWithProfileIdRequest {
  public readonly companyId: string;
  public readonly profileId: string;
  public readonly roles: RoleCompanyEmployeeEnum[];

  constructor(partial: Partial<AddCompanyEmployeeWithProfileIdRequest>) {
    Object.assign(this, partial);
  }
}

import { RoleCompanyEmployeeEnum } from '../../../domain/enum/role-company-employee.enum';

export class AddCompanyEmployeeCommand {
  public readonly companyId: string;
  public readonly profileId: string;
  public readonly roles: RoleCompanyEmployeeEnum[];

  constructor(partial: Partial<AddCompanyEmployeeCommand>) {
    Object.assign(this, partial);
  }
}

import { RoleCompanyEmployeeEnum } from '../../../domain/enum/role-company-employee.enum';

export class GiveRightToEmployeeCommand {
  public readonly companyId: string;
  public readonly profileId: string;
  public readonly roles: RoleCompanyEmployeeEnum[];

  constructor(partial: Partial<GiveRightToEmployeeCommand>) {
    Object.assign(this, partial);
  }
}

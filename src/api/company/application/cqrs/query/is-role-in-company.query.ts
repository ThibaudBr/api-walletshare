import {RoleCompanyEmployeeEnum} from "../../../domain/enum/role-company-employee.enum";

export class IsRoleInCompanyQuery {
  constructor(partial: Partial<IsRoleInCompanyQuery>) {
    Object.assign(this, partial);
  }

  public readonly companyId: string;
  public readonly userId: string;
  public readonly roles: RoleCompanyEmployeeEnum[];
}

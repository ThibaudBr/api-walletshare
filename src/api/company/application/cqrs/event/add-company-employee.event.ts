import { RoleCompanyEmployeeEnum } from 'src/api/company/domain/enum/role-company-employee.enum';

export class AddCompanyEmployeeEvent {
  public readonly module: string = 'company';
  public readonly method: string = 'add-company-employee';
  public readonly companyId: string;
  public readonly profileId: string;
  public readonly roles: RoleCompanyEmployeeEnum[];

  constructor(partial: Partial<AddCompanyEmployeeEvent>) {
    Object.assign(this, partial);
  }
}

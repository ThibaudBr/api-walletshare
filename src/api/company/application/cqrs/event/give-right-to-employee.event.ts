import { RoleCompanyEmployeeEnum } from '../../../domain/enum/role-company-employee.enum';

export class GiveRightToEmployeeEvent {
  public readonly module: string = 'company';
  public readonly method: string = 'give-right-to-employee';
  public readonly companyId: string;
  public readonly profileId: string;
  public readonly roles: RoleCompanyEmployeeEnum[];

  constructor(partial: Partial<GiveRightToEmployeeEvent>) {
    Object.assign(this, partial);
  }
}

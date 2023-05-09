import { CreateUserDto } from '../../../user/domain/dto/create-user.dto';
import { CreateProfileDto } from '../../../profile/domain/dto/create-profile.dto';
import { RoleCompanyEmployeeEnum } from '../../domain/enum/role-company-employee.enum';

export class CreateUserForCompanyRequest {
  constructor(partial: Partial<CreateUserForCompanyRequest>) {
    Object.assign(this, partial);
  }

  public readonly companyId: string;
  public readonly createUserDto: CreateUserDto;
  public readonly createProfileDto: CreateProfileDto;
  public readonly companyEmployeeRoles: RoleCompanyEmployeeEnum[];
}

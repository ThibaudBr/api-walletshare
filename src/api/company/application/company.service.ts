import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllCompanyQuery } from './cqrs/query/get-all-company.query';
import { CompanyResponse } from '../web/response/company.response';
import { CompanyEntity } from '../domain/entities/company.entity';
import { GetCompanyByIdQuery } from './cqrs/query/get-company-by-id.query';
import { GetCompanyDiscoveryQuery } from './cqrs/query/get-company-discovery.query';
import { InvalidIdHttpException } from '../../../util/exception/custom-http-exception/invalid-id.http-exception';
import { GetCompanyDiscoveryRequest } from '../web/request/get-company-discovery.request';
import { GetCompanyWithCriteriaQuery } from './cqrs/query/get-company-with-criteria.query';
import { GetCompanyWithCriteriaRequest } from '../web/request/get-company-with-criteria.request';
import { GetCompanyWithProfileIdQuery } from './cqrs/query/get-company-with-profile-id.query';
import { GetCompanyWithUserIdQuery } from './cqrs/query/get-company-with-user-id.query';
import { IsRoleInCompanyQuery } from './cqrs/query/is-role-in-company.query';
import { RemoveCompanyCommand } from './cqrs/command/remove-company.command';
import { RestoreCompanyCommand } from './cqrs/command/restore-company.command';
import { AddCompanyEmployeeRequest } from '../web/request/add-company-employee.request';
import { RemoveCompanyEmployeeRequest } from '../web/request/remove-company-employee.request';
import { GiveRightToEmployeeRequest } from '../web/request/give-right-to-employee.request';
import { CreateCompanyRequest } from '../web/request/create-company.request';
import { UpdateCompanyRequest } from '../web/request/update-company.request';
import { TransferOwnershipOfCompanyRequest } from '../web/request/transfer-ownership-of-company.request';
import { AddCompanyEmployeeCommand } from './cqrs/command/add-company-employee.command';
import { RoleCompanyEmployeeEnum } from '../domain/enum/role-company-employee.enum';
import { RemoveCompanyEmployeeCommand } from './cqrs/command/remove-company-employee.command';
import { GiveRightToEmployeeCommand } from './cqrs/command/give-right-to-employee.command';
import { TransferOwnershipOfCompanyCommand } from './cqrs/command/transfer-ownership-of-company.command';
import { SoftRemoveCompanyCommand } from './cqrs/command/soft-remove-company.command';
import { UpdateCompanyCommand } from './cqrs/command/update-company.command';
import { CreateCompanyCommand } from './cqrs/command/create-company.command';

@Injectable()
export class CompanyService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async getAllCompanies(): Promise<CompanyResponse[]> {
    return this.queryBus
      .execute(new GetAllCompanyQuery())
      .then((companies: CompanyEntity[]) => {
        return companies.map((company: CompanyEntity) => {
          return new CompanyResponse({
            ...company,
          });
        });
      })
      .catch(async error => {
        throw error;
      });
  }

  public async getCompanyById(id: string): Promise<CompanyResponse> {
    return this.queryBus
      .execute(new GetCompanyByIdQuery({ companyId: id }))
      .then((company: CompanyEntity) => {
        return new CompanyResponse({
          ...company,
        });
      })
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        throw error;
      });
  }

  public async getCompanyDiscovery(getCompanyDiscoveryRequest: GetCompanyDiscoveryRequest): Promise<CompanyResponse[]> {
    return this.queryBus
      .execute(
        new GetCompanyDiscoveryQuery({
          userX: getCompanyDiscoveryRequest?.userX,
          userY: getCompanyDiscoveryRequest?.userY,
          occupationIdList: getCompanyDiscoveryRequest.occupationIdList,
          distance: getCompanyDiscoveryRequest?.distance,
        }),
      )
      .then((companiesDiscovery: CompanyEntity[]) => {
        return companiesDiscovery.map((companyDiscovery: CompanyEntity) => {
          return new CompanyResponse({
            ...companyDiscovery,
          });
        });
      })
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        throw error;
      });
  }

  public async getCompanyWithCriteria(
    getCompanyWithCriteriaRequest: GetCompanyWithCriteriaRequest,
  ): Promise<CompanyResponse[]> {
    return this.queryBus
      .execute(
        new GetCompanyWithCriteriaQuery({
          isDeleted: getCompanyWithCriteriaRequest?.isDeleted,
        }),
      )
      .then((companiesDiscovery: CompanyEntity[]) => {
        return companiesDiscovery.map((companyDiscovery: CompanyEntity) => {
          return new CompanyResponse({
            ...companyDiscovery,
          });
        });
      })
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        throw error;
      });
  }

  public async getCompanyByProfileId(profileId: string): Promise<CompanyResponse[]> {
    return this.queryBus
      .execute(
        new GetCompanyWithProfileIdQuery({
          profileId: profileId,
        }),
      )
      .then((companiesDiscovery: CompanyEntity[]) => {
        return companiesDiscovery.map((companyDiscovery: CompanyEntity) => {
          return new CompanyResponse({
            ...companyDiscovery,
          });
        });
      })
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        throw error;
      });
  }

  public async getCompanyByUserId(userId: string): Promise<CompanyResponse[]> {
    return this.queryBus
      .execute(
        new GetCompanyWithUserIdQuery({
          userId: userId,
        }),
      )
      .then((companiesDiscovery: CompanyEntity[]) => {
        return companiesDiscovery.map((companyDiscovery: CompanyEntity) => {
          return new CompanyResponse({
            ...companyDiscovery,
          });
        });
      })
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        throw error;
      });
  }

  public async isRoleInCompany(userId: string, companyId: string, roles: RoleCompanyEmployeeEnum[]): Promise<boolean> {
    return this.queryBus
      .execute(
        new IsRoleInCompanyQuery({
          userId: userId,
          companyId: companyId,
          roles: roles,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        if (error.message === 'User not found') throw new InvalidIdHttpException('User not found');
        throw error;
      });
  }

  public async addCompanyEmployee(userId: string, addCompanyEmployeeRequest: AddCompanyEmployeeRequest): Promise<void> {
    if (
      !(await this.isRoleInCompany(userId, addCompanyEmployeeRequest.companyId, [
        RoleCompanyEmployeeEnum.ADMIN,
        RoleCompanyEmployeeEnum.OWNER,
      ]))
    )
      throw new ForbiddenException('You are not allowed to add an employee to this company');
    await this.commandBus
      .execute(
        new AddCompanyEmployeeCommand({
          companyId: addCompanyEmployeeRequest.companyId,
          profileId: addCompanyEmployeeRequest.profileId,
          roles: addCompanyEmployeeRequest.roles,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        if (error.message === 'Profile not found') throw new InvalidIdHttpException('Profile not found');
        throw error;
      });
  }

  public async removeCompanyEmployee(
    userId: string,
    removeCompanyEmployeeRequest: RemoveCompanyEmployeeRequest,
  ): Promise<void> {
    if (
      !(await this.isRoleInCompany(userId, removeCompanyEmployeeRequest.companyId, [
        RoleCompanyEmployeeEnum.ADMIN,
        RoleCompanyEmployeeEnum.OWNER,
      ]))
    )
      throw new ForbiddenException('You are not allowed to remove an employee to this company');

    await this.commandBus
      .execute(
        new RemoveCompanyEmployeeCommand({
          companyId: removeCompanyEmployeeRequest.companyId,
          profileId: removeCompanyEmployeeRequest.profileId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        if (error.message === 'Profile not found') throw new InvalidIdHttpException('Profile not found');
        throw error;
      });
  }

  public async giveRightToCompanyEmployee(
    userId: string,
    giveRightToCompanyEmployeeRequest: GiveRightToEmployeeRequest,
  ): Promise<void> {
    if (
      !(await this.isRoleInCompany(userId, giveRightToCompanyEmployeeRequest.companyId, [
        RoleCompanyEmployeeEnum.ADMIN,
        RoleCompanyEmployeeEnum.OWNER,
      ]))
    )
      throw new ForbiddenException('You are not allowed to give roles to an employee in this company');

    await this.commandBus
      .execute(
        new GiveRightToEmployeeCommand({
          companyId: giveRightToCompanyEmployeeRequest.companyId,
          profileId: giveRightToCompanyEmployeeRequest.profileId,
          roles: giveRightToCompanyEmployeeRequest.roles,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        if (error.message === 'Profile not found') throw new InvalidIdHttpException('Profile not found');
        throw error;
      });
  }

  public async addCompanyEmployeeAdmin(addCompanyEmployeeRequest: AddCompanyEmployeeRequest): Promise<void> {
    await this.commandBus
      .execute(
        new AddCompanyEmployeeCommand({
          companyId: addCompanyEmployeeRequest.companyId,
          profileId: addCompanyEmployeeRequest.profileId,
          roles: addCompanyEmployeeRequest.roles,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        if (error.message === 'Profile not found') throw new InvalidIdHttpException('Profile not found');
        throw error;
      });
  }

  public async removeCompanyEmployeeAdmin(removeCompanyEmployeeRequest: RemoveCompanyEmployeeRequest): Promise<void> {
    await this.commandBus
      .execute(
        new RemoveCompanyEmployeeCommand({
          companyId: removeCompanyEmployeeRequest.companyId,
          profileId: removeCompanyEmployeeRequest.profileId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        if (error.message === 'Profile not found') throw new InvalidIdHttpException('Profile not found');
        throw error;
      });
  }

  public async giveRightToCompanyEmployeeAdmin(
    giveRightToCompanyEmployeeRequest: GiveRightToEmployeeRequest,
  ): Promise<void> {
    await this.commandBus
      .execute(
        new GiveRightToEmployeeCommand({
          companyId: giveRightToCompanyEmployeeRequest.companyId,
          profileId: giveRightToCompanyEmployeeRequest.profileId,
          roles: giveRightToCompanyEmployeeRequest.roles,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        if (error.message === 'Profile not found') throw new InvalidIdHttpException('Profile not found');
        throw error;
      });
  }

  public async createCompany(userId: string, createCompanyRequest: CreateCompanyRequest): Promise<void> {
    await this.commandBus
      .execute(
        new CreateCompanyCommand({
          createCompanyDto: createCompanyRequest.createCompanyDto,
          occupationIdList: createCompanyRequest?.occupationListId,
          profileId: createCompanyRequest.profileId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company already exists') throw new ConflictException('Company already exists');
        throw error;
      });
  }

  public async updateCompany(
    userId: string,
    companyId: string,
    updateCompanyRequest: UpdateCompanyRequest,
  ): Promise<void> {
    if (
      !(await this.isRoleInCompany(userId, companyId, [RoleCompanyEmployeeEnum.ADMIN, RoleCompanyEmployeeEnum.OWNER]))
    )
      throw new ForbiddenException('You are not allowed to update this company');

    await this.commandBus
      .execute(
        new UpdateCompanyCommand({
          companyId: companyId,
          updateCompanyDto: updateCompanyRequest.updateCompanyDto,
          updateOccupationIdList: updateCompanyRequest?.occupationListId,
          newProfileOwnerId: updateCompanyRequest?.profileId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        throw error;
      });
  }

  public async softRemoveCompany(userId: string, companyId: string): Promise<void> {
    if (!(await this.isRoleInCompany(userId, companyId, [RoleCompanyEmployeeEnum.OWNER])))
      throw new ForbiddenException('You are not allowed to delete this company');
  }

  public async transferOwnershipOfCompany(
    userId: string,
    transferOwnershipOfCompanyRequest: TransferOwnershipOfCompanyRequest,
  ): Promise<void> {
    if (
      !(await this.isRoleInCompany(userId, transferOwnershipOfCompanyRequest.companyId, [
        RoleCompanyEmployeeEnum.OWNER,
      ]))
    )
      throw new ForbiddenException('You are not allowed to transfer ownership of this company');
  }

  public async createCompanyAdmin(createCompanyRequest: CreateCompanyRequest): Promise<void> {
    await this.commandBus
      .execute(
        new CreateCompanyCommand({
          profileId: createCompanyRequest.profileId,
          createCompanyDto: createCompanyRequest.createCompanyDto,
          occupationIdList: createCompanyRequest.occupationListId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Occupation not found') throw new InvalidIdHttpException('Occupation not found');
        throw error;
      });
  }

  public async updateCompanyAdmin(companyId: string, updateCompanyRequest: UpdateCompanyRequest): Promise<void> {
    await this.commandBus
      .execute(
        new UpdateCompanyCommand({
          companyId: companyId,
          updateCompanyDto: updateCompanyRequest.updateCompanyDto,
          updateOccupationIdList: updateCompanyRequest.occupationListId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        if (error.message === 'Occupation not found') throw new InvalidIdHttpException('Occupation not found');
        throw error;
      });
  }

  public async softRemoveCompanyAdmin(companyId: string): Promise<void> {
    await this.commandBus.execute(new SoftRemoveCompanyCommand({ companyId: companyId })).catch(async error => {
      if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
      throw error;
    });
  }

  public async transferOwnershipOfCompanyAdmin(
    transferOwnershipOfCompanyRequest: TransferOwnershipOfCompanyRequest,
  ): Promise<void> {
    await this.commandBus
      .execute(
        new TransferOwnershipOfCompanyCommand({
          companyId: transferOwnershipOfCompanyRequest.companyId,
          profileId: transferOwnershipOfCompanyRequest.profileId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        if (error.message === 'Profile not found') throw new InvalidIdHttpException('Profile not found');
        throw error;
      });
  }

  public async removeCompanyAdmin(companyId: string): Promise<void> {
    await this.commandBus.execute(new RemoveCompanyCommand({ companyId: companyId })).catch(async error => {
      if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
      throw error;
    });
  }

  public async restoreCompanyAdmin(companyId: string): Promise<void> {
    await this.commandBus.execute(new RestoreCompanyCommand({ companyId: companyId })).catch(async error => {
      if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
      throw error;
    });
  }
}
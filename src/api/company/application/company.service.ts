import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
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
import { AddCompanyEmployeeWithProfileIdRequest } from '../web/request/add-company-employee-with-profile-id.request';
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
import { CreateUserForCompanyRequest } from '../web/request/create-user-for-company.request';
import { ErrorCustomEvent } from '../../../util/exception/error-handler/error-custom.event';
import { CreateUserCommand } from '../../user/application/cqrs/command/create-user.command';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { UserResponse } from '../../user/web/response/user.response';
import { CreateProfileCommand } from '../../profile/application/cqrs/command/create-profile.command';
import { UserNotFoundHttpException } from '../../../util/exception/custom-http-exception/user-not-found.http-exception';
import { InvalidParameterEntityHttpException } from '../../../util/exception/custom-http-exception/invalid-parameter-entity.http-exception';
import { GetAllCardPresetByCompanyIdQuery } from './cqrs/query/get-all-card-preset-by-company-id.query';
import { CardPresetResponse } from '../web/response/card-preset.response';
import { GetCardPresetByIdQuery } from './cqrs/query/get-card-preset-by-id.query';
import { CreateCardPresetCommand } from './cqrs/command/create-card-preset.command';
import { CreateCardPresetRequest } from '../web/request/create-card-preset.request';
import { CardPresetEntity } from '../domain/entities/card-preset.entity';
import { UpdateCardPresetCommand } from './cqrs/command/update-card-preset.command';
import { UpdateCardPresetRequest } from '../web/request/update-card-preset.request';
import { RemoveCardPresetCommand } from './cqrs/command/remove-card-preset.command';
import { SoftRemoveCardPresetCommand } from './cqrs/command/soft-remove-card-preset.command';
import { RestoreCardPresetCommand } from './cqrs/command/restore-card-preset.command';
import { RoleProfileEnum } from '../../profile/domain/enum/role-profile.enum';
import { UserEntity } from '../../user/domain/entities/user.entity';
import { AddCompanyEmployeeRequest } from '../web/request/add-company-employee.request';
import { GetUserByIdQuery } from './cqrs/query/get-user-by-id.query';
import { ProfileEntity } from '../../profile/domain/entities/profile.entity';
import { UpdateUserRoleCommand } from '../../user/application/cqrs/command/update-user-role.command';
import { ApiMailService } from '../../api-mail/application/api-mail.service';
import { GetCompanyByOwnerUserIdQuery } from './cqrs/query/get-company-by-owner-user-id.query';
import { CompanyEmployeeEntity } from '../domain/entities/company-employee.entity';
import { GetCompanyEmployeeByOwnerUserIdQuery } from './cqrs/query/get-company-employee-by-owner-user-id.query';
import { GetCardPresetByCompanyIdQuery } from './cqrs/query/get-card-preset-by-company-id.query';
import { GetCompanyPresetByOwnerUserIdQuery } from './cqrs/query/get-company-preset-by-owner-user-id.query';
import { ChartResponse } from '../web/response/chart.response';
import * as moment from 'moment';
import { GetCompanyEmployeeByOwnerUserIdForChartQuery } from './cqrs/query/get-company-employee-by-owner-user-id-for-chart.query';
import { TypeOfCardEnum } from '../../card/domain/enum/type-of-card.enum';
import {DuplicateMailHttpException} from "../../../util/exception/custom-http-exception/duplicate-mail.http-exception";
import {
  DuplicateUsernameHttpException
} from "../../../util/exception/custom-http-exception/duplicate-username.http-exception";

@Injectable()
export class CompanyService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    private readonly apiMailService: ApiMailService,
  ) {}

  public async getAllCompanies(deleted: boolean, take: number, skip: number): Promise<CompanyResponse[]> {
    return this.queryBus
      .execute(
        new GetAllCompanyQuery({
          deleted: deleted,
          take: take,
          skip: skip,
        }),
      )
      .then((companies: CompanyEntity[]) => {
        return companies.map((company: CompanyEntity) => {
          return new CompanyResponse({
            ...company,
          });
        });
      })
      .catch(async error => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async getCompanyById(id: string, fullCompany?: boolean): Promise<CompanyResponse> {
    return this.queryBus
      .execute(new GetCompanyByIdQuery({ companyId: id, fullCompany: fullCompany }))
      .then((company: CompanyEntity) => {
        return new CompanyResponse({
          ...company,
        });
      })
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        throw new InternalServerErrorException(error.message);
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
        throw new InternalServerErrorException(error.message);
      });
  }

  public async getCompanyWithCriteria(
    getCompanyWithCriteriaRequest: GetCompanyWithCriteriaRequest,
  ): Promise<CompanyResponse[]> {
    return this.queryBus
      .execute(
        new GetCompanyWithCriteriaQuery({
          id: getCompanyWithCriteriaRequest.companyId,
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
        throw new InternalServerErrorException(error.message);
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
        throw new InternalServerErrorException(error.message);
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
        throw new InternalServerErrorException(error.message);
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
        throw new InternalServerErrorException(error.message);
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

    const userEntity: UserEntity = await this.queryBus
      .execute(
        new GetUserByIdQuery({
          userId: addCompanyEmployeeRequest.userId,
        }),
      )
      .catch(async error => {
        if (error.message === 'User not found') throw new InvalidIdHttpException('User not found');
        throw new InternalServerErrorException(error.message);
      });

    if (userEntity.profiles.some((profile: ProfileEntity) => profile.roleProfile === RoleProfileEnum.COMPANY)) {
      throw new BadRequestException('This user is already in a company');
    }

    const profileId: string = await this.commandBus
      .execute(
        new CreateProfileCommand({
          userId: addCompanyEmployeeRequest.userId,
          createProfileDto: {
            usernameProfile: userEntity.username ?? 'undefined',
            roleProfile: RoleProfileEnum.COMPANY,
          },
        }),
      )
      .catch(async e => {
        if (e.message === 'User not found') throw new UserNotFoundHttpException();
        else if (e instanceof Array) throw new InvalidParameterEntityHttpException(e);
        else if (e.message === 'Occupation not found') throw new InvalidIdHttpException();
        else if (e.message === 'Profile with given role already exist') throw new ForbiddenException(e.message);
        else throw e;
      });

    userEntity.roles = userEntity.roles.concat(UserRoleEnum.COMPANY_EMPLOYEE_ACCOUNT);
    await this.commandBus.execute(
      new UpdateUserRoleCommand({
        userId: addCompanyEmployeeRequest.userId,
        roles: userEntity.roles,
      }),
    );
    await this.commandBus
      .execute(
        new AddCompanyEmployeeCommand({
          companyId: addCompanyEmployeeRequest.companyId,
          profileId: profileId,
          roles: [RoleCompanyEmployeeEnum.EMPLOYEE],
        }),
      )
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        if (error.message === 'Profile not found') throw new InvalidIdHttpException('Profile not found');
        throw new InternalServerErrorException(error.message);
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
        throw new InternalServerErrorException(error.message);
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
        throw new InternalServerErrorException(error.message);
      });
  }

  public async addCompanyEmployeeAdmin(
    addCompanyEmployeeRequest: AddCompanyEmployeeWithProfileIdRequest,
  ): Promise<void> {
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
        throw new InternalServerErrorException(error.message);
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
        throw new InternalServerErrorException(error.message);
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
        throw new InternalServerErrorException(error.message);
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
        throw new InternalServerErrorException(error.message);
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
        throw new InternalServerErrorException(error.message);
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
        throw new InternalServerErrorException(error.message);
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
        throw new InternalServerErrorException(error.message);
      });
  }

  public async softRemoveCompanyAdmin(companyId: string): Promise<void> {
    await this.commandBus.execute(new SoftRemoveCompanyCommand({ companyId: companyId })).catch(async error => {
      if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
      throw new InternalServerErrorException(error.message);
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
        throw new InternalServerErrorException(error.message);
      });
  }

  public async removeCompanyAdmin(companyId: string): Promise<void> {
    await this.commandBus.execute(new RemoveCompanyCommand({ companyId: companyId })).catch(async error => {
      if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
      throw new InternalServerErrorException(error.message);
    });
  }

  public async restoreCompanyAdmin(companyId: string): Promise<void> {
    await this.commandBus.execute(new RestoreCompanyCommand({ companyId: companyId })).catch(async error => {
      if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
      throw new InternalServerErrorException(error.message);
    });
  }

  async createUserAndProfileForCompany(id: string, createUserForCompany: CreateUserForCompanyRequest): Promise<void> {
    if (
      !(await this.queryBus.execute(
        new IsRoleInCompanyQuery({
          userId: id,
          companyId: createUserForCompany.companyId,
          roles: [RoleCompanyEmployeeEnum.ADMIN, RoleCompanyEmployeeEnum.OWNER],
        }),
      ))
    ) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'CreateUserAndProfileForCompany',
          localisation: 'Company',
          error: 'User is not allowed to create user and profile for this company',
        }),
      );
      throw new ForbiddenException('You are not allowed to create user and profile for this company');
    }

    const generatePassword: string = this.generatePassword();
    const userResponse: UserResponse = await this.commandBus
      .execute(
        new CreateUserCommand({
          ...createUserForCompany.createUserDto,
          password: generatePassword,
          roles: [UserRoleEnum.COMPANY_EMPLOYEE_ACCOUNT, UserRoleEnum.PUBLIC],
        }),
      )
      .catch(async error => {
        if (error.message === 'User already exists') throw new ConflictException('User already exists');
        if (error instanceof DuplicateMailHttpException) throw new DuplicateMailHttpException();
        if (error instanceof DuplicateUsernameHttpException) throw new DuplicateUsernameHttpException();
        throw new InternalServerErrorException(error.message);
      });

    const profileId: string = await this.commandBus
      .execute(
        new CreateProfileCommand({
          userId: userResponse.id,
          createProfileDto: {
            usernameProfile: createUserForCompany.createProfileDto.usernameProfile,
            roleProfile: RoleProfileEnum.COMPANY,
          },
        }),
      )
      .catch(async e => {
        if (e.message === 'User not found') throw new UserNotFoundHttpException();
        else if (e instanceof Array) throw new InvalidParameterEntityHttpException(e);
        else if (e.message === 'Occupation not found') throw new InvalidIdHttpException();
        else if (e.message === 'Profile with given role already exist') throw new ForbiddenException(e.message);
        else throw e;
      });

    await this.addCompanyEmployeeAdmin({
      profileId: profileId,
      companyId: createUserForCompany.companyId,
      roles: createUserForCompany.companyEmployeeRoles,
    }).catch(async error => {
      if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
      if (error.message === 'Profile not found') throw new InvalidIdHttpException('Profile not found');
      if (error.message === 'Role not found') throw new InvalidIdHttpException('Role not found');
      if (error.message === 'Role already exist') throw new ConflictException('Role already exist');
      throw new InternalServerErrorException(error.message);
    });

    if (createUserForCompany.createUserDto.mail) {
      try {
        await this.apiMailService.sendMail({
          path: 'created-user-for-company',
          email: createUserForCompany.createUserDto.mail,
          title: 'You have been add to a company',
          message: 'je sais pas',
          password: generatePassword,
          language: createUserForCompany.language,
        });
      } catch (error) {
        console.error('error while sending mail');
      }
    }
  }

  async getAllCardPresetByCompanyId(userId: string, companyId: string): Promise<CardPresetResponse[]> {
    if (
      await this.isRoleInCompany(userId, companyId, [
        RoleCompanyEmployeeEnum.OWNER,
        RoleCompanyEmployeeEnum.ADMIN,
        RoleCompanyEmployeeEnum.EMPLOYEE,
      ])
    ) {
      return this.queryBus.execute(new GetAllCardPresetByCompanyIdQuery({ companyId: companyId }));
    }

    throw new ForbiddenException('You are not allowed to get card preset for this company');
  }

  async getCardPresetById(userId: string, companyId: string, cardPresetId: string): Promise<CardPresetResponse> {
    if (await this.isRoleInCompany(userId, companyId, [RoleCompanyEmployeeEnum.OWNER, RoleCompanyEmployeeEnum.ADMIN])) {
      return this.queryBus.execute(new GetCardPresetByIdQuery({ id: cardPresetId }));
    }

    throw new ForbiddenException('You are not allowed to get card preset for this company');
  }

  async createCardPreset(
    userId: string,
    createCardPresetRequest: CreateCardPresetRequest,
  ): Promise<CardPresetResponse> {
    if (
      !(await this.isRoleInCompany(userId, createCardPresetRequest.companyId, [
        RoleCompanyEmployeeEnum.OWNER,
        RoleCompanyEmployeeEnum.ADMIN,
      ]))
    ) {
      throw new ForbiddenException('You are not allowed to create card preset for this company');
    }

    return await this.commandBus
      .execute(
        new CreateCardPresetCommand({
          companyId: createCardPresetRequest.companyId,
          alignment: createCardPresetRequest.alignment,
          backgroundColor: createCardPresetRequest.backgroundColor,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        if (error.message === 'Card preset is not valid') throw new ConflictException('Card preset already exists');
        if (error.message === 'Error while saving card preset')
          throw new ConflictException('Error while saving card preset');
        throw new InternalServerErrorException(error.message);
      })
      .then((cardPresetEntity: CardPresetEntity) => {
        return new CardPresetResponse({
          ...cardPresetEntity,
        });
      });
  }

  async updateCardPreset(
    userId: string,
    companyId: string,
    updateCardPresetRequest: UpdateCardPresetRequest,
  ): Promise<CardPresetResponse> {
    if (
      !(await this.isRoleInCompany(userId, companyId, [RoleCompanyEmployeeEnum.OWNER, RoleCompanyEmployeeEnum.ADMIN]))
    ) {
      throw new ForbiddenException('You are not allowed to update card preset for this company');
    }

    return await this.commandBus
      .execute(
        new UpdateCardPresetCommand({
          id: updateCardPresetRequest.id,
          alignment: updateCardPresetRequest.alignment,
          backgroundColor: updateCardPresetRequest.backgroundColor,
        }),
      )
      .catch(async error => {
        if (error.message === 'Card preset not found') throw new InvalidIdHttpException('Card preset not found');
        if (error.message === 'Card preset is not valid') throw new ConflictException('Card preset already exists');
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        if (error.message === 'Error while updating card preset')
          throw new ConflictException('Error while updating card preset');
        throw new InternalServerErrorException(error.message);
      })
      .then((cardPresetEntity: CardPresetEntity) => {
        return new CardPresetResponse({
          ...cardPresetEntity,
        });
      });
  }

  async removeCardPreset(cardPresetId: string): Promise<void> {
    await this.commandBus.execute(new RemoveCardPresetCommand({ id: cardPresetId })).catch(async error => {
      if (error.message === 'Card preset not found') throw new InvalidIdHttpException('Card preset not found');
      if (error.message === 'Error while removing card preset')
        throw new ConflictException('Error while deleting card preset');
      throw new InternalServerErrorException(error.message);
    });
  }

  async restoreCardPreset(cardPresetId: string): Promise<void> {
    await this.commandBus.execute(new RestoreCardPresetCommand({ id: cardPresetId })).catch(async error => {
      if (error.message === 'Card preset not found') throw new InvalidIdHttpException('Card preset not found');
      if (error.message === 'Error while restoring card preset')
        throw new ConflictException('Error while restoring card preset');
      throw new InternalServerErrorException(error.message);
    });
  }

  async softRemoveCardPreset(userId: string, companyId: string, cardPresetId: string): Promise<void> {
    if (
      !(await this.isRoleInCompany(userId, companyId, [RoleCompanyEmployeeEnum.OWNER, RoleCompanyEmployeeEnum.ADMIN]))
    ) {
      throw new ForbiddenException('You are not allowed to delete card preset for this company');
    }

    await this.commandBus.execute(new SoftRemoveCardPresetCommand({ id: cardPresetId })).catch(async error => {
      if (error.message === 'Card preset not found') throw new InvalidIdHttpException('Card preset not found');
      if (error.message === 'Error while deleting card preset')
        throw new ConflictException('Error while deleting card preset');
      throw new InternalServerErrorException(error.message);
    });
  }

  async softRemoveCardPresetAdmin(cardPresetId: string): Promise<void> {
    await this.commandBus.execute(new SoftRemoveCardPresetCommand({ id: cardPresetId })).catch(async error => {
      if (error.message === 'Card preset not found') throw new InvalidIdHttpException('Card preset not found');
      if (error.message === 'Error while deleting card preset')
        throw new ConflictException('Error while deleting card preset');
      throw new InternalServerErrorException(error.message);
    });
  }

  async getAllCompanyCount(): Promise<number> {
    return await this.getAllCompanies(false, -1, -1).then((companies: CompanyEntity[]) => {
      return companies.length;
    });
  }

  async getAllCardCompanyCount(userId: string, companyId: string): Promise<number> {
    if (
      !(await this.isRoleInCompany(userId, companyId, [
        RoleCompanyEmployeeEnum.OWNER,
        RoleCompanyEmployeeEnum.ADMIN,
        RoleCompanyEmployeeEnum.EMPLOYEE,
      ]))
    ) {
      throw new ForbiddenException('You are not allowed to get card preset for this company');
    }
    return await this.getCompanyById(companyId).then((company: CompanyEntity) => {
      return company.employees.reduce((totalCards, employee) => {
        return totalCards + (employee.profile.personalCards?.length ?? 0);
      }, 0);
    });
  }

  async getEmployeeCount(userId: string, companyId: string): Promise<number> {
    if (
      !(await this.isRoleInCompany(userId, companyId, [
        RoleCompanyEmployeeEnum.OWNER,
        RoleCompanyEmployeeEnum.ADMIN,
        RoleCompanyEmployeeEnum.EMPLOYEE,
      ]))
    ) {
      throw new ForbiddenException('You are not allowed to get card preset for this company');
    }

    return await this.getCompanyById(companyId).then((company: CompanyEntity) => {
      return company.employees.length;
    });
  }

  async getAllCardViewCount(userId: string, companyId: string): Promise<number> {
    if (
      !(await this.isRoleInCompany(userId, companyId, [
        RoleCompanyEmployeeEnum.OWNER,
        RoleCompanyEmployeeEnum.ADMIN,
        RoleCompanyEmployeeEnum.EMPLOYEE,
      ]))
    ) {
      throw new ForbiddenException('You are not allowed to get card preset for this company');
    }

    return await this.getCompanyById(companyId).then((company: CompanyEntity) => {
      return company.employees.reduce((totalViews, employee) => {
        return (
          totalViews + (employee.profile.personalCards?.reduce((total, card) => total + card.numberOfShares, 0) ?? 0)
        );
      }, 0);
    });
  }

  async getAllCardForwardCount(userId: string, companyId: string): Promise<number> {
    if (
      !(await this.isRoleInCompany(userId, companyId, [
        RoleCompanyEmployeeEnum.OWNER,
        RoleCompanyEmployeeEnum.ADMIN,
        RoleCompanyEmployeeEnum.EMPLOYEE,
      ]))
    ) {
      throw new ForbiddenException('You are not allowed to get card forward for this company');
    }

    return await this.getCompanyById(companyId, true).then((company: CompanyEntity) => {
      return (
        company.employees.reduce((totalForwards, employee) => {
          return (
            totalForwards +
            (employee.profile.personalCards?.reduce((total, card) => total + card.connectedCardTwo.length, 0) ?? 0)
          );
        }, 0) +
        company.employees.reduce((totalForwards, employee) => {
          return (
            totalForwards +
            (employee.profile.personalCards?.reduce((total, card) => total + card.connectedCardOne.length, 0) ?? 0)
          );
        }, 0)
      );
    });
  }

  async getMyCompanyByOwnerUserId(userId: string): Promise<CompanyEntity> {
    return await this.queryBus
      .execute(
        new GetCompanyByOwnerUserIdQuery({
          userId: userId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company not found') throw new NotFoundException('Company not found');
        throw new InternalServerErrorException(error.message);
      });
  }

  async getCompanyEmployeeByOwnerUserId(userId: string): Promise<CompanyEmployeeEntity[]> {
    return await this.queryBus
      .execute(
        new GetCompanyEmployeeByOwnerUserIdQuery({
          userId: userId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company employee not found') throw new NotFoundException('Company employee not found');
        throw new InternalServerErrorException(error.message);
      });
  }

  async getCardPresetByOwnerUserId(userId: string): Promise<CardPresetEntity[]> {
    return await this.queryBus
      .execute(
        new GetCompanyPresetByOwnerUserIdQuery({
          userId: userId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Card preset not found') throw new NotFoundException('Card preset not found');
        throw new InternalServerErrorException(error.message);
      });
  }

  async getCardPresetByCompanyId(userId: string, companyId: string): Promise<CardPresetEntity[]> {
    if (
      !(await this.isRoleInCompany(userId, companyId, [
        RoleCompanyEmployeeEnum.OWNER,
        RoleCompanyEmployeeEnum.ADMIN,
        RoleCompanyEmployeeEnum.EMPLOYEE,
      ]))
    ) {
      throw new ForbiddenException('You are not allowed to get card preset for this company');
    }

    return await this.queryBus
      .execute(
        new GetCardPresetByCompanyIdQuery({
          companyId: companyId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Card preset not found') throw new NotFoundException('Card preset not found');
        throw new InternalServerErrorException(error.message);
      });
  }

  private generatePassword(): string {
    return 'Pt' + Math.random().toString(10).split('.')[1] + '!';
  }

  async getAllEmployeePersonalCardView(userId: string, companyId: string): Promise<ChartResponse[]> {
    if (!(await this.isRoleInCompany(userId, companyId, [RoleCompanyEmployeeEnum.OWNER]))) {
      throw new ForbiddenException('You are not allowed to get card preset for this company');
    }

    const employees: CompanyEmployeeEntity[] = await this.queryBus
      .execute(
        new GetCompanyEmployeeByOwnerUserIdForChartQuery({
          userId: userId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company employee not found') throw new NotFoundException('Company employee not found');
        throw new InternalServerErrorException(error.message);
      });

    return await this.groupByHourForCompanyAndPersonalCard(employees);
  }

  async getEmployeePersonalCardViewByEmployeeId(
    userId: string,
    companyId: string,
    employeeId: string,
  ): Promise<ChartResponse[]> {
    if (!(await this.isRoleInCompany(userId, companyId, [RoleCompanyEmployeeEnum.OWNER]))) {
      throw new ForbiddenException('You are not allowed to get card preset for this company');
    }

    const employees: CompanyEmployeeEntity[] = await this.queryBus
      .execute(
        new GetCompanyEmployeeByOwnerUserIdForChartQuery({
          userId: userId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company employee not found') throw new NotFoundException('Company employee not found');
        throw new InternalServerErrorException(error.message);
      });

    for (const employee of employees) {
      if (employee.id === employeeId) {
        return await this.groupByHourForEmployeeAndPersonalCard(employee);
      }
    }
    throw new BadRequestException('Employee not found in company');
  }

  async getCompanyForwardCard(userId: string, companyId: string): Promise<ChartResponse[]> {
    if (!(await this.isRoleInCompany(userId, companyId, [RoleCompanyEmployeeEnum.OWNER]))) {
      throw new ForbiddenException('You are not allowed to get card preset for this company');
    }

    const employees: CompanyEmployeeEntity[] = await this.queryBus
      .execute(
        new GetCompanyEmployeeByOwnerUserIdForChartQuery({
          userId: userId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company employee not found') throw new NotFoundException('Company employee not found');
        throw new InternalServerErrorException(error.message);
      });

    return await this.groupByHourForCompanyForward(employees);
  }

  async getCompanyForwardCardByEmployeeId(
    userId: string,
    companyId: string,
    employeeId: string,
  ): Promise<ChartResponse[]> {
    if (!(await this.isRoleInCompany(userId, companyId, [RoleCompanyEmployeeEnum.OWNER]))) {
      throw new ForbiddenException('You are not allowed to get card preset for this company');
    }

    const employees: CompanyEmployeeEntity[] = await this.queryBus
      .execute(
        new GetCompanyEmployeeByOwnerUserIdForChartQuery({
          userId: userId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company employee not found') throw new NotFoundException('Company employee not found');
        throw new InternalServerErrorException(error.message);
      });

    for (const employee of employees) {
      if (employee.id === employeeId) {
        return await this.groupByHourForEmployeeForward(employee);
      }
    }

    throw new BadRequestException('Employee not found in company');
  }

  async getCompanyReceivedCard(userId: string, companyId: string): Promise<ChartResponse[]> {
    if (!(await this.isRoleInCompany(userId, companyId, [RoleCompanyEmployeeEnum.OWNER]))) {
      throw new ForbiddenException('You are not allowed to get card preset for this company');
    }

    const employees: CompanyEmployeeEntity[] = await this.queryBus
      .execute(
        new GetCompanyEmployeeByOwnerUserIdForChartQuery({
          userId: userId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company employee not found') throw new NotFoundException('Company employee not found');
        throw new InternalServerErrorException(error.message);
      });

    return await this.groupByHourForCompanyReceived(employees);
  }

  async getCompanyReceivedCardByEmployeeId(
    userId: string,
    companyId: string,
    employeeId: string,
  ): Promise<ChartResponse[]> {
    if (!(await this.isRoleInCompany(userId, companyId, [RoleCompanyEmployeeEnum.OWNER]))) {
      throw new ForbiddenException('You are not allowed to get card preset for this company');
    }

    const employees: CompanyEmployeeEntity[] = await this.queryBus
      .execute(
        new GetCompanyEmployeeByOwnerUserIdForChartQuery({
          userId: userId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Company employee not found') throw new NotFoundException('Company employee not found');
        throw new InternalServerErrorException(error.message);
      });

    for (const employee of employees) {
      if (employee.id === employeeId) {
        return await this.groupByHourForEmployeeReceived(employee);
      }
    }

    throw new BadRequestException('Employee not found in company');
  }

  private async groupByHourForCompanyAndPersonalCard(employees: CompanyEmployeeEntity[]): Promise<ChartResponse[]> {
    const dateFormat = 'YYYY-MM-DD HH';
    const countsByDate: { [key: string]: number } = {};

    for (const employee of employees) {
      if (employee.profile?.personalCards) {
        for (const card of employee.profile.personalCards) {
          for (const view of card.cardViews) {
            const date = moment(view.createdAt).format(dateFormat);
            countsByDate[date] = (countsByDate[date] || 0) + 1;
          }
        }
      }
    }

    const responses: ChartResponse[] = [];
    for (const date in countsByDate) {
      responses.push(new ChartResponse({ y: countsByDate[date], x: date }));
    }

    responses.sort((a, b) => a.x.localeCompare(b.x));

    return responses;
  }

  private async groupByHourForCompanyForward(employees: CompanyEmployeeEntity[]): Promise<ChartResponse[]> {
    const dateFormat = 'YYYY-MM-DD HH';
    const countsByDate: { [key: string]: number } = {};

    for (const employee of employees) {
      if (employee.profile?.personalCards) {
        for (const card of employee.profile.personalCards) {
          for (const connectedCard of card.connectedCardOne) {
            console.log('connectedCard', connectedCard);
            const date = moment(connectedCard.createdAt).format(dateFormat);
            countsByDate[date] = (countsByDate[date] || 0) + 1;
          }
        }
      }
    }

    const responses: ChartResponse[] = [];
    for (const date in countsByDate) {
      responses.push(new ChartResponse({ y: countsByDate[date], x: date }));
    }

    responses.sort((a, b) => a.x.localeCompare(b.x));

    return responses;
  }

  private async groupByHourForEmployeeForward(employee: CompanyEmployeeEntity): Promise<ChartResponse[]> {
    const dateFormat = 'YYYY-MM-DD HH';
    const countsByDate: { [key: string]: number } = {};

    if (employee.profile?.personalCards) {
      for (const card of employee.profile.personalCards) {
        for (const connectedCard of card.connectedCardOne) {
          const date = moment(connectedCard.createdAt).format(dateFormat);
          countsByDate[date] = (countsByDate[date] || 0) + 1;
        }
      }
    }

    const responses: ChartResponse[] = [];
    for (const date in countsByDate) {
      responses.push(new ChartResponse({ y: countsByDate[date], x: date }));
    }

    // Trier par date
    responses.sort((a, b) => a.x.localeCompare(b.x));

    return responses;
  }

  private async groupByHourForCompanyReceived(employees: CompanyEmployeeEntity[]): Promise<ChartResponse[]> {
    const dateFormat = 'YYYY-MM-DD HH';
    const countsByDate: { [key: string]: number } = {};

    for (const employee of employees) {
      if (employee.profile?.personalCards) {
        for (const card of employee.profile.personalCards) {
          for (const connectedCard of card.connectedCardOne) {
            const date = moment(connectedCard.createdAt).format(dateFormat);
            countsByDate[date] = (countsByDate[date] || 0) + 1;
          }
        }
      }
    }

    const responses: ChartResponse[] = [];
    for (const date in countsByDate) {
      responses.push(new ChartResponse({ y: countsByDate[date], x: date }));
    }

    // Trier par date
    responses.sort((a, b) => a.x.localeCompare(b.x));

    return responses;
  }

  private async groupByHourForEmployeeReceived(employee: CompanyEmployeeEntity): Promise<ChartResponse[]> {
    const dateFormat = 'YYYY-MM-DD HH';
    const countsByDate: { [key: string]: number } = {};

    if (employee.profile?.personalCards) {
      for (const card of employee.profile.personalCards) {
        for (const connectedCard of card.connectedCardOne) {
          const date = moment(connectedCard.createdAt).format(dateFormat);
          countsByDate[date] = (countsByDate[date] || 0) + 1;
        }
      }
    }

    const responses: ChartResponse[] = [];
    for (const date in countsByDate) {
      responses.push(new ChartResponse({ y: countsByDate[date], x: date }));
    }

    // Trier par date
    responses.sort((a, b) => a.x.localeCompare(b.x));

    return responses;
  }

  private async groupByHourForEmployeeAndPersonalCard(employee: CompanyEmployeeEntity): Promise<ChartResponse[]> {
    const dateFormat = 'YYYY-MM-DD HH';
    const countsByDate: { [key: string]: number } = {};

    if (employee.profile?.personalCards) {
      for (const card of employee.profile.personalCards) {
        for (const view of card.cardViews) {
          const date = moment(view.createdAt).format(dateFormat);
          countsByDate[date] = (countsByDate[date] || 0) + 1;
        }
      }
    }

    const responses: ChartResponse[] = [];
    for (const date in countsByDate) {
      responses.push(new ChartResponse({ y: countsByDate[date], x: date }));
    }

    responses.sort((a, b) => a.x.localeCompare(b.x));

    return responses;
  }
}

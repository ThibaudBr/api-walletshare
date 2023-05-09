import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompanyService } from '../application/company.service';
import { CompanyResponse } from './response/company.response';
import { RoleGuard } from '../../auth/web/guards/role.guard';
import { GetCompanyDiscoveryRequest } from './request/get-company-discovery.request';
import { RequestUser } from '../../auth/domain/interface/request-user.interface';
import { AddCompanyEmployeeRequest } from './request/add-company-employee.request';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { GetCompanyWithCriteriaQuery } from '../application/cqrs/query/get-company-with-criteria.query';
import { CreateCompanyRequest } from './request/create-company.request';
import { UpdateCompanyRequest } from './request/update-company.request';
import { TransferOwnershipOfCompanyRequest } from './request/transfer-ownership-of-company.request';
import { CreateUserForCompanyRequest } from './request/create-user-for-company.request';

@Controller('company')
@ApiTags('Company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // implement all the endpoint of CompanyService here with exemple of GroupController

  @Get('/public/get-company-by-id/:id')
  @ApiOperation({ summary: 'Get company by id' })
  @ApiOkResponse({ type: CompanyResponse })
  @ApiNotFoundResponse({ description: 'Company not found' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getCompanyById(@Param('id') id: string): Promise<CompanyResponse> {
    return await this.companyService.getCompanyById(id);
  }

  @Get('/public/get-company-by-user-id/:userId')
  @ApiOperation({ summary: 'Get company by user id' })
  @ApiOkResponse({ type: CompanyResponse })
  @ApiNotFoundResponse({ description: 'Company not found' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getCompanyByUserId(@Param('userId') userId: string): Promise<CompanyResponse[]> {
    return await this.companyService.getCompanyByUserId(userId);
  }

  @Get('/public/get-company-by-profile-id/:profileId')
  @ApiOperation({ summary: 'Get company by profile id' })
  @ApiOkResponse({ type: CompanyResponse })
  @ApiNotFoundResponse({ description: 'Company not found' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getCompanyByProfileId(@Param('profileId') profileId: string): Promise<CompanyResponse[]> {
    return await this.companyService.getCompanyByProfileId(profileId);
  }

  @Post('/public/get-company-discovery')
  @ApiOperation({ summary: 'Get company discovery' })
  @ApiOkResponse({ type: CompanyResponse })
  @ApiNotFoundResponse({ description: 'Company not found' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getCompanyDiscovery(
    @Body() getCompanyDiscoveryRequest: GetCompanyDiscoveryRequest,
  ): Promise<CompanyResponse[]> {
    return await this.companyService.getCompanyDiscovery(getCompanyDiscoveryRequest);
  }

  @Post('/admin/get-company-with-criteria')
  @ApiOperation({ summary: 'Get company with criteria' })
  @ApiOkResponse({ type: CompanyResponse })
  @ApiNotFoundResponse({ description: 'Company not found' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getCompanyWithCriteria(
    @Body() getCompanyDiscoveryRequest: GetCompanyWithCriteriaQuery,
  ): Promise<CompanyResponse[]> {
    return await this.companyService.getCompanyWithCriteria(getCompanyDiscoveryRequest);
  }

  @Post('/company/create-user-and-profile-for-company')
  @ApiOperation({ summary: 'create user for company' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async createUserForCompany(
    @Req() requestUser: RequestUser,
    @Body() createUserForCompany: CreateUserForCompanyRequest,
  ): Promise<void> {
    return await this.companyService.createUserAndProfileForCompany(requestUser.user.id, createUserForCompany);
  }

  @Get('/admin/get-all-companies')
  @ApiOperation({ summary: 'Get all companies' })
  @ApiOkResponse({ type: CompanyResponse })
  @ApiNotFoundResponse({ description: 'Company not found' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllCompanies(): Promise<CompanyResponse[]> {
    return await this.companyService.getAllCompanies();
  }

  @Post('/public/add-company-employee')
  @ApiOperation({ summary: 'Add company employee' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async addCompanyEmployee(
    @Req() requestUser: RequestUser,
    @Body() addCompanyEmployeeRequest: AddCompanyEmployeeRequest,
  ): Promise<void> {
    return await this.companyService.addCompanyEmployee(requestUser.user.id, addCompanyEmployeeRequest);
  }

  @Post('/public/remove-company-employee')
  @ApiOperation({ summary: 'Remove company employee' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async removeCompanyEmployee(
    @Req() requestUser: RequestUser,
    @Body() removeCompanyEmployeeRequest: AddCompanyEmployeeRequest,
  ): Promise<void> {
    return await this.companyService.removeCompanyEmployee(requestUser.user.id, removeCompanyEmployeeRequest);
  }

  @Post('/public/give-rights-to-company-employee')
  @ApiOperation({ summary: 'Give rights to company employee' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async giveRightsToCompanyEmployee(
    @Req() requestUser: RequestUser,
    @Body() giveRightsToCompanyEmployeeRequest: AddCompanyEmployeeRequest,
  ): Promise<void> {
    return await this.companyService.giveRightToCompanyEmployee(
      requestUser.user.id,
      giveRightsToCompanyEmployeeRequest,
    );
  }

  @Post('/admin/add-company-employee')
  @ApiOperation({ summary: 'Add company employee' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async adminAddCompanyEmployee(@Body() addCompanyEmployeeRequest: AddCompanyEmployeeRequest): Promise<void> {
    return await this.companyService.addCompanyEmployeeAdmin(addCompanyEmployeeRequest);
  }

  @Post('/admin/remove-company-employee')
  @ApiOperation({ summary: 'Remove company employee' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async adminRemoveCompanyEmployee(@Body() removeCompanyEmployeeRequest: AddCompanyEmployeeRequest): Promise<void> {
    return await this.companyService.removeCompanyEmployeeAdmin(removeCompanyEmployeeRequest);
  }

  @Post('/admin/give-rights-to-company-employee')
  @ApiOperation({ summary: 'Give rights to company employee' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async adminGiveRightsToCompanyEmployee(
    @Body() giveRightsToCompanyEmployeeRequest: AddCompanyEmployeeRequest,
  ): Promise<void> {
    return await this.companyService.giveRightToCompanyEmployeeAdmin(giveRightsToCompanyEmployeeRequest);
  }

  @Post('/company/create-company')
  @ApiOperation({ summary: 'Create company' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async createCompany(
    @Req() requestUser: RequestUser,
    @Body() createCompanyRequest: CreateCompanyRequest,
  ): Promise<void> {
    return await this.companyService.createCompany(requestUser.user.id, createCompanyRequest);
  }

  @Put('/public/update-company/:companyId')
  @ApiOperation({ summary: 'Update company' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async updateCompany(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
    @Body() updateCompanyRequest: UpdateCompanyRequest,
  ): Promise<void> {
    return await this.companyService.updateCompany(requestUser.user.id, companyId, updateCompanyRequest);
  }

  @Put('/admin/update-company/:companyId')
  @ApiOperation({ summary: 'Update company' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async adminUpdateCompany(
    @Param('companyId') companyId: string,
    @Body() updateCompanyRequest: UpdateCompanyRequest,
  ): Promise<void> {
    return await this.companyService.updateCompanyAdmin(companyId, updateCompanyRequest);
  }

  @Post('/admin/create-company')
  @ApiOperation({ summary: 'Create company' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async adminCreateCompany(@Body() createCompanyRequest: CreateCompanyRequest): Promise<void> {
    return await this.companyService.createCompanyAdmin(createCompanyRequest);
  }

  @Put('/public/transfer-ownership-of-company')
  @ApiOperation({ summary: 'Transfer ownership of company' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async transferOwnershipOfCompany(
    @Req() requestUser: RequestUser,
    @Body() transferOwnershipOfCompanyRequest: TransferOwnershipOfCompanyRequest,
  ): Promise<void> {
    return await this.companyService.transferOwnershipOfCompany(requestUser.user.id, transferOwnershipOfCompanyRequest);
  }

  @Put('/admin/transfer-ownership-of-company')
  @ApiOperation({ summary: 'Transfer ownership of company' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async adminTransferOwnershipOfCompany(
    @Body() transferOwnershipOfCompanyRequest: TransferOwnershipOfCompanyRequest,
  ): Promise<void> {
    return await this.companyService.transferOwnershipOfCompanyAdmin(transferOwnershipOfCompanyRequest);
  }

  @Delete('/public/delete-company/:companyId')
  @ApiOperation({ summary: 'Delete company' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async deleteCompany(@Req() requestUser: RequestUser, @Param('companyId') companyId: string): Promise<void> {
    return await this.companyService.softRemoveCompany(requestUser.user.id, companyId);
  }

  @Delete('/admin/delete-company/:companyId')
  @ApiOperation({ summary: 'Delete company' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async adminDeleteCompany(@Param('companyId') companyId: string): Promise<void> {
    return await this.companyService.softRemoveCompanyAdmin(companyId);
  }

  @Delete('/admin/hard-delete-company/:companyId')
  @ApiOperation({ summary: 'Hard delete company' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async adminHardDeleteCompany(@Param('companyId') companyId: string): Promise<void> {
    return await this.companyService.removeCompanyAdmin(companyId);
  }

  @Put('/admin/restore-company/:companyId')
  @ApiOperation({ summary: 'Restore company' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async adminRestoreCompany(@Param('companyId') companyId: string): Promise<void> {
    return await this.companyService.restoreCompanyAdmin(companyId);
  }
}

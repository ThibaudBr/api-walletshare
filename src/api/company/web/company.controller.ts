import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompanyService } from '../application/company.service';
import { CompanyResponse } from './response/company.response';
import { RoleGuard } from '../../auth/web/guards/role.guard';
import { GetCompanyDiscoveryRequest } from './request/get-company-discovery.request';
import { RequestUser } from '../../auth/domain/interface/request-user.interface';
import { AddCompanyEmployeeWithProfileIdRequest } from './request/add-company-employee-with-profile-id.request';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { GetCompanyWithCriteriaQuery } from '../application/cqrs/query/get-company-with-criteria.query';
import { CreateCompanyRequest } from './request/create-company.request';
import { UpdateCompanyRequest } from './request/update-company.request';
import { TransferOwnershipOfCompanyRequest } from './request/transfer-ownership-of-company.request';
import { CreateUserForCompanyRequest } from './request/create-user-for-company.request';
import { CardPresetResponse } from './response/card-preset.response';
import { UpdateCardPresetRequest } from './request/update-card-preset.request';
import { CreateCardPresetRequest } from './request/create-card-preset.request';
import { RemoveCompanyEmployeeRequest } from './request/remove-company-employee.request';
import { AddCompanyEmployeeRequest } from './request/add-company-employee.request';
import { CompanyEntity } from '../domain/entities/company.entity';
import { CompanyEmployeeEntity } from '../domain/entities/company-employee.entity';
import { CardPresetEntity } from '../domain/entities/card-preset.entity';
import { ChartResponse } from './response/chart.response';

@Controller('company')
@ApiTags('Company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('/public/get-company-by-id/:id')
  @ApiOperation({ summary: 'Get company by id' })
  @ApiOkResponse({ type: CompanyResponse })
  @ApiNotFoundResponse({ description: 'Company not found' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getCompanyById(@Param('id') id: string): Promise<CompanyResponse> {
    return await this.companyService.getCompanyById(id);
  }

  @Get('/company/get-my-company-by-owner-user-id')
  @ApiOperation({ summary: 'Get company by id' })
  @ApiOkResponse({ type: CompanyResponse })
  @ApiNotFoundResponse({ description: 'Company not found' })
  @UseGuards(RoleGuard([UserRoleEnum.COMPANY_ACCOUNT, UserRoleEnum.COMPANY_EMPLOYEE_ACCOUNT, UserRoleEnum.ADMIN]))
  async getMyCompanyByOwnerUserId(@Req() requestUser: RequestUser): Promise<CompanyEntity> {
    return await this.companyService.getMyCompanyByOwnerUserId(requestUser.user.id);
  }

  @Get('/company/get-my-company-employee-by-owner-user-id')
  @UseGuards(RoleGuard([UserRoleEnum.COMPANY_ACCOUNT, UserRoleEnum.COMPANY_EMPLOYEE_ACCOUNT, UserRoleEnum.ADMIN]))
  async getCompanyEmployeeByUserId(@Req() requestUser: RequestUser): Promise<CompanyEmployeeEntity[]> {
    return await this.companyService.getCompanyEmployeeByOwnerUserId(requestUser.user.id);
  }

  @Get('/company/get-my-company-by-owner-user-id')
  @UseGuards(RoleGuard([UserRoleEnum.COMPANY_ACCOUNT, UserRoleEnum.COMPANY_EMPLOYEE_ACCOUNT, UserRoleEnum.ADMIN]))
  async get(@Req() requestUser: RequestUser): Promise<CardPresetEntity[]> {
    return await this.companyService.getCardPresetByOwnerUserId(requestUser.user.id);
  }

  @Get('/public/get-preset-of-my-company/:companyId')
  @UseGuards(RoleGuard([UserRoleEnum.COMPANY_ACCOUNT, UserRoleEnum.COMPANY_EMPLOYEE_ACCOUNT, UserRoleEnum.ADMIN]))
  async getCardPresetByCompanyIdEntity(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
  ): Promise<CardPresetEntity[]> {
    return await this.companyService.getCardPresetByCompanyId(requestUser.user.id, companyId);
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

  @Get('/admin/get-all-companies/:deleted/:take/:skip')
  @ApiOperation({ summary: 'Get all companies' })
  @ApiOkResponse({ type: CompanyResponse })
  @ApiNotFoundResponse({ description: 'Company not found' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllCompanies(
    @Param('deleted') deleted = false,
    @Param('take') take = -1,
    @Param('skip') skip = -1,
  ): Promise<CompanyResponse[]> {
    return await this.companyService.getAllCompanies(deleted, take, skip);
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
    @Body() removeCompanyEmployeeRequest: RemoveCompanyEmployeeRequest,
  ): Promise<void> {
    return await this.companyService.removeCompanyEmployee(requestUser.user.id, removeCompanyEmployeeRequest);
  }

  @Post('/public/give-rights-to-company-employee')
  @ApiOperation({ summary: 'Give rights to company employee' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async giveRightsToCompanyEmployee(
    @Req() requestUser: RequestUser,
    @Body() giveRightsToCompanyEmployeeRequest: AddCompanyEmployeeWithProfileIdRequest,
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
  async adminAddCompanyEmployee(
    @Body() addCompanyEmployeeRequest: AddCompanyEmployeeWithProfileIdRequest,
  ): Promise<void> {
    return await this.companyService.addCompanyEmployeeAdmin(addCompanyEmployeeRequest);
  }

  @Post('/admin/remove-company-employee')
  @ApiOperation({ summary: 'Remove company employee' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async adminRemoveCompanyEmployee(
    @Body() removeCompanyEmployeeRequest: AddCompanyEmployeeWithProfileIdRequest,
  ): Promise<void> {
    return await this.companyService.removeCompanyEmployeeAdmin(removeCompanyEmployeeRequest);
  }

  @Post('/admin/give-rights-to-company-employee')
  @ApiOperation({ summary: 'Give rights to company employee' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async adminGiveRightsToCompanyEmployee(
    @Body() giveRightsToCompanyEmployeeRequest: AddCompanyEmployeeWithProfileIdRequest,
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
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC, UserRoleEnum.COMPANY_ACCOUNT]))
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

  @Get('/public/get-card-preset/:companyId/:cardPresetId')
  @ApiOperation({ summary: 'Get card preset' })
  @ApiOkResponse({ type: CardPresetResponse })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getCardPreset(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
    @Param('cardPresetId') cardPresetId: string,
  ): Promise<CardPresetResponse> {
    return await this.companyService.getCardPresetById(requestUser.user.id, companyId, cardPresetId);
  }

  @Get('/public/get-all-card-preset-by-company-id/:companyId')
  @ApiOperation({ summary: 'Get card preset by company id' })
  @ApiOkResponse({ type: [CardPresetResponse] })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getCardPresetByCompanyId(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
  ): Promise<CardPresetResponse[]> {
    return await this.companyService.getAllCardPresetByCompanyId(requestUser.user.id, companyId);
  }

  @Post('/public/create-card-preset')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create card preset' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async createCardPreset(
    @Req() requestUser: RequestUser,
    @Body() createCardPresetRequest: CreateCardPresetRequest,
  ): Promise<CardPresetResponse> {
    return await this.companyService.createCardPreset(requestUser.user.id, createCardPresetRequest);
  }

  @Put('/public/update-card-preset/:companyId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update card preset' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async updateCardPreset(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
    @Body() updateCardPresetRequest: UpdateCardPresetRequest,
  ): Promise<CardPresetResponse> {
    return await this.companyService.updateCardPreset(requestUser.user.id, companyId, updateCardPresetRequest);
  }

  @Delete('/public/delete-card-preset/:companyId/:cardPresetId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete card preset' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async deleteCardPreset(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
    @Param('cardPresetId') cardPresetId: string,
  ): Promise<void> {
    return await this.companyService.softRemoveCardPreset(requestUser.user.id, companyId, cardPresetId);
  }

  @Delete('/admin/delete-card-preset/:cardPresetId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete card preset' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async adminDeleteCardPreset(@Param('cardPresetId') cardPresetId: string): Promise<void> {
    return await this.companyService.softRemoveCardPresetAdmin(cardPresetId);
  }

  @Put('/admin/restore-card-preset/:cardPresetId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore card preset' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async adminRestoreCardPreset(@Param('cardPresetId') cardPresetId: string): Promise<void> {
    return await this.companyService.restoreCardPreset(cardPresetId);
  }

  @Delete('/admin/soft-remove-card-preset/:cardPresetId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft remove card preset' })
  @ApiOkResponse({ type: 'Ok' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async adminSoftRemoveCardPreset(@Param('cardPresetId') cardPresetId: string): Promise<void> {
    return await this.companyService.softRemoveCardPresetAdmin(cardPresetId);
  }

  @Get('/admin/get-all-company-count')
  @ApiOperation({ summary: 'Get all company count' })
  @ApiOkResponse({ type: Number })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllCompanyCount(): Promise<number> {
    return await this.companyService.getAllCompanyCount();
  }

  @Get('/company/get-all-card-company-count-by-company-id/:companyId')
  @ApiOperation({ summary: 'Get all card company count' })
  @ApiOkResponse({ type: Number })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async getAllCardCompanyCount(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
  ): Promise<number> {
    return await this.companyService.getAllCardCompanyCount(requestUser.user.id, companyId);
  }

  @Get('/company/get-employee-count-by-company-id/:companyId')
  @ApiOperation({ summary: 'Get employee count' })
  @ApiOkResponse({ type: Number })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async getEmployeeCount(@Param('companyId') companyId: string, @Req() requestUser: RequestUser): Promise<number> {
    return await this.companyService.getEmployeeCount(requestUser.user.id, companyId);
  }

  @Get('/company/get-all-card-view-count-by-company-id/:companyId')
  @ApiOperation({ summary: 'Get all card view count' })
  @ApiOkResponse({ type: Number })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async getAllCardViewCount(@Req() requestUser: RequestUser, @Param('companyId') companyId: string): Promise<number> {
    return await this.companyService.getAllCardViewCount(requestUser.user.id, companyId);
  }

  @Get('/company/get-all-card-forward-count-by-company-id/:companyId')
  @ApiOperation({ summary: 'Get all card forward count' })
  @ApiOkResponse({ type: Number })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async getAllCardForwardCount(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
  ): Promise<number> {
    return await this.companyService.getAllCardForwardCount(requestUser.user.id, companyId);
  }

  @Get('/company/chart/get-all-employee-personal-card-view/:companyId')
  @ApiOperation({ summary: 'Get all employee personal card view' })
  @ApiOkResponse({ type: '{ x: Number, y: Date}' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async getAllEmployeePersonalCardView(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
  ): Promise<ChartResponse[]> {
    return await this.companyService.getAllEmployeePersonalCardView(requestUser.user.id, companyId);
  }

  @Get('/company/chart/get-employee-personal-card-view-by-employee-id/:companyId/:employeeId')
  @ApiOperation({ summary: 'Get employee personal card view by employee id' })
  @ApiOkResponse({ type: '{ x: Number, y: Date}' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async getEmployeePersonalCardViewByEmployeeId(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
  ): Promise<ChartResponse[]> {
    return await this.companyService.getEmployeePersonalCardViewByEmployeeId(
      requestUser.user.id,
      companyId,
      employeeId,
    );
  }

  @Get('/company/chart/get-company-forward-card/:companyId')
  @ApiOperation({ summary: 'Get company forward card' })
  @ApiOkResponse({ type: '{ x: Number, y: Date}' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async getCompanyForwardCard(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
  ): Promise<ChartResponse[]> {
    return await this.companyService.getCompanyForwardCard(requestUser.user.id, companyId);
  }

  @Get('/company/chart/get-company-forward-card-by-employee-id/:companyId/:employeeId')
  @ApiOperation({ summary: 'Get company forward card by employee id' })
  @ApiOkResponse({ type: '{ x: Number, y: Date}' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async getCompanyForwardCardByEmployeeId(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
  ): Promise<ChartResponse[]> {
    return await this.companyService.getCompanyForwardCardByEmployeeId(requestUser.user.id, companyId, employeeId);
  }

  @Get('/company/chart/get-company-received-card/:companyId')
  @ApiOperation({ summary: 'Get company received card' })
  @ApiOkResponse({ type: '{ x: Number, y: Date}' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async getCompanyReceivedCard(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
  ): Promise<ChartResponse[]> {
    return await this.companyService.getCompanyReceivedCard(requestUser.user.id, companyId);
  }

  @Get('/company/chart/get-company-received-card-by-employee-id/:companyId/:employeeId')
  @ApiOperation({ summary: 'Get company received card by employee id' })
  @ApiOkResponse({ type: '{ x: Number, y: Date}' })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async getCompanyReceivedCardByEmployeeId(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
  ): Promise<ChartResponse[]> {
    return await this.companyService.getCompanyReceivedCardByEmployeeId(requestUser.user.id, companyId, employeeId);
  }
}

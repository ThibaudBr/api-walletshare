import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OccupationService } from '../application/occupation.service';
import { RoleGuard } from '../../auth/web/guards/role.guard';
import { OccupationResponse } from './response/occupation-response';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { GetOccupationWithCriteriaRequest } from './request/get-occupation-with-criteria.request';
import { CreateOccupationRequest } from './request/create-occupation.request';

@Controller('/occupation')
@ApiTags('Occupation')
export class OccupationController {
  constructor(private readonly occupationService: OccupationService) {}

  @Get('/public/')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getAllOccupations(): Promise<OccupationResponse[]> {
    return await this.occupationService.getAllOccupation();
  }

  @Get('/public/:id')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getOccupationById(@Param('id') occupationId: string): Promise<OccupationResponse> {
    return await this.occupationService.getOccupationById(occupationId);
  }

  @Post('/admin/get-with-criteria')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getOccupationsWithCriteria(
    @Body() getOccupationsWithCriteriaRequest: GetOccupationWithCriteriaRequest,
  ): Promise<OccupationResponse[]> {
    return await this.occupationService.getOccupationWithCriteria(getOccupationsWithCriteriaRequest);
  }

  @Post('/admin/create')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async createOccupation(@Body() createOccupationRequest: CreateOccupationRequest): Promise<void> {
    return await this.occupationService.createOccupation(createOccupationRequest);
  }

  @Put('/admin/update/:id')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async updateOccupation(
    @Param('id') occupationId: string,
    @Body() createOccupationRequest: CreateOccupationRequest,
  ): Promise<void> {
    return await this.occupationService.updateOccupation(occupationId, createOccupationRequest);
  }

  @Delete('/admin/delete/:id')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async deleteOccupation(@Param('id') occupationId: string): Promise<void> {
    return await this.occupationService.deleteOccupation(occupationId);
  }

  @Delete('/admin/soft-delete/:id')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async softDeleteOccupation(@Param('id') occupationId: string): Promise<void> {
    return await this.occupationService.softDeleteOccupation(occupationId);
  }

  @Put('/admin/restore/:id')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async restoreOccupation(@Param('id') occupationId: string): Promise<void> {
    return await this.occupationService.restoreOccupation(occupationId);
  }
}

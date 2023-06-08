import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SocialNetworkService } from '../application/social-network.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateSocialNetworkRequest } from './request/create-social-network.request';
import { RoleGuard } from '../../auth/web/guards/role.guard';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { SocialNetworkResponse } from './response/social-network.response';
import { GetSocialNetworkWithCriteriaRequest } from './request/get-social-network-with-criteria.request';
import { UpdateSocialNetworkRequest } from './request/update-social-network.request';

@Controller('social-network')
@ApiTags('SocialNetwork')
export class SocialNetworkController {
  constructor(private readonly socialNetworkService: SocialNetworkService) {}

  @Get('/public/')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getAllSocialNetworks(): Promise<SocialNetworkResponse[]> {
    return await this.socialNetworkService.getAllSocialNetwork();
  }

  @Get('/public/:id')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getSocialNetworkById(@Param('id') socialNetworkId: string): Promise<SocialNetworkResponse> {
    return await this.socialNetworkService.getSocialNetworkById(socialNetworkId);
  }

  @Post('/admin/get-with-criteria')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getSocialNetworksWithCriteria(
    @Body() getSocialNetworksWithCriteriaRequest: GetSocialNetworkWithCriteriaRequest,
  ): Promise<SocialNetworkResponse[]> {
    return await this.socialNetworkService
      .getSocialNetworkWithCriteria(getSocialNetworksWithCriteriaRequest)
      .catch(error => {
        throw error;
      });
  }

  @Post('/admin/create')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async createSocialNetwork(@Body() createSocialNetworkRequest: CreateSocialNetworkRequest): Promise<void> {
    return await this.socialNetworkService.createSocialNetwork(createSocialNetworkRequest);
  }

  @Put('/admin/update/:id')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async updateSocialNetwork(
    @Param('id') socialNetworkId: string,
    @Body() createSocialNetworkRequest: UpdateSocialNetworkRequest,
  ): Promise<void> {
    return await this.socialNetworkService
      .updateSocialNetwork(socialNetworkId, createSocialNetworkRequest)
      .catch(error => {
        throw error;
      });
  }

  @Delete('/admin/delete/:id')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async deleteSocialNetwork(@Param('id') socialNetworkId: string): Promise<void> {
    return await this.socialNetworkService.deleteSocialNetwork(socialNetworkId);
  }

  @Put('/admin/restore/:id')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async restoreSocialNetwork(@Param('id') socialNetworkId: string): Promise<void> {
    return await this.socialNetworkService.restoreSocialNetwork(socialNetworkId);
  }
}

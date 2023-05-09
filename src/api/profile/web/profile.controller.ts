import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileService } from '../application/profile.service';
import { ProfileResponse } from './response/profile.response';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { RoleGuard } from '../../auth/web/guards/role.guard';
import { RequestUser } from '../../auth/domain/interface/request-user.interface';
import { GetProfilesWithCriteriaRequest } from './request/get-profiles-with-criteria.request';
import { UpdateProfileRequest } from './request/update-profile.request';
import { CreateProfileRequest } from './request/create-profile.request';

@Controller('profile')
@ApiTags('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * @api {get} /profile Get all profiles
   * @apiName GetallProfiles
   * @apiGroup Profile
   * @apiVersion 0.0.8
   * @apiDescription Get all profiles
   * @apiSuccess {Object[]} profiles List of profiles
   */
  @Get('/admin/')
  @ApiResponse({
    status: 200,
    description: 'List of profiles',
    content: {
      'application/json': {
        example: [
          { id: 1, name: 'Profile 1' },
          { id: 2, name: 'Profile 2' },
        ],
      },
    },
  })
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllProfiles(): Promise<ProfileResponse[]> {
    return await this.profileService.getProfiles().catch(error => {
      throw error;
    });
  }

  @Get('/public/get-my-profile/:id')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getProfileById(@Req() requestUser: RequestUser, @Param('id') profileId: string): Promise<ProfileResponse> {
    const { id } = requestUser.user;
    return await this.profileService.getMyProfile(id, profileId).catch(error => {
      throw error;
    });
  }

  @Get('/public/get-profile/:id')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getProfile(@Param('id') profileId: string): Promise<ProfileResponse> {
    return await this.profileService.getProfile(profileId).catch(error => {
      throw error;
    });
  }

  @Get('/admin/with-user-id/:id')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getProfileByUserId(@Param('id') userId: string): Promise<ProfileResponse[]> {
    return await this.profileService.getProfileByUserId(userId).catch(error => {
      throw error;
    });
  }

  @Get('/public/get-my-profiles')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getMyProfiles(@Req() requestUser: RequestUser): Promise<ProfileResponse[]> {
    const { id } = requestUser.user;
    return await this.profileService.getProfileByUserId(id).catch(error => {
      throw error;
    });
  }

  @Post('/admin/get-with-criteria')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getProfilesWithCriteria(
    @Body() getProfilesWithCriteriaRequest: GetProfilesWithCriteriaRequest,
  ): Promise<ProfileResponse[]> {
    return await this.profileService.getProfilesWithCriteria(getProfilesWithCriteriaRequest).catch(error => {
      throw error;
    });
  }

  @Put('/admin/update-profile/:id')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async updateProfile(@Param('id') profileId: string, @Body() profile: UpdateProfileRequest): Promise<void> {
    return await this.profileService.updateProfile(profileId, profile).catch(error => {
      throw error;
    });
  }

  @Put('/public/update-my-profile')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async updateMyProfile(@Req() requestUser: RequestUser, @Body() profile: UpdateProfileRequest): Promise<void> {
    const { id } = requestUser.user;
    return await this.profileService.updateMyProfile(id, profile).catch(error => {
      throw error;
    });
  }

  @Post('/public/create-profile')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async createProfile(
    @Req() userRequest: RequestUser,
    @Body() profile: CreateProfileRequest,
  ): Promise<ProfileResponse> {
    return await this.profileService.createProfile(userRequest.user.id, profile).catch(error => {
      throw error;
    });
  }

  @Post('/admin/create-profile')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async createProfileAdmin(@Body() profile: CreateProfileRequest): Promise<ProfileResponse> {
    return await this.profileService.createProfileAdmin(profile).catch(error => {
      throw error;
    });
  }

  @Delete('/admin/delete-profile/:id')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async deleteProfile(@Param('id') profileId: string): Promise<void> {
    return await this.profileService.deleteProfile(profileId).catch(error => {
      throw error;
    });
  }

  @Delete('/admin/soft-delete-profile/:id')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async deleteMyProfile(@Param('id') profileId: string): Promise<void> {
    return await this.profileService.softDeleteProfile(profileId);
  }

  @Put('/admin/restore-profile/:id')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async restoreProfile(@Param('id') profileId: string): Promise<void> {
    return await this.profileService.restoreProfile(profileId).catch(error => {
      throw error;
    });
  }
}
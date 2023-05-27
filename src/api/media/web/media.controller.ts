import { Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MediaService } from '../application/media.service';
import { RoleGuard } from '../../auth/web/guards/role.guard';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaResponse } from './response/media.response';
import { RequestUser } from '../../auth/domain/interface/request-user.interface';
import { ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('media')
@ApiTags('Media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/public/get-media-with-id/:mediaId')
  async getMediaWithId(@Param('mediaId') mediaId: string): Promise<MediaResponse> {
    return await this.mediaService.getMediaWithId(mediaId);
  }

  @Get('/public/get-all-media')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllMedia(): Promise<MediaResponse[]> {
    return await this.mediaService.getAllMedia();
  }

  @Post('/public/add-avatar-company/:companyId')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async addAvatarCompany(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.mediaService.addAvatarCompany(requestUser.user.id, companyId, {
      imageBuffer: file.buffer,
      fileName: file.originalname,
    });
  }

  @Post('/public/add-avatar-group/:groupId')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async addAvatarGroup(
    @Req() requestUser: RequestUser,
    @Param('groupId') groupId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.mediaService.addAvatarGroupMedia(requestUser.user.id, groupId, {
      imageBuffer: file.buffer,
      fileName: file.originalname,
    });
  }

  @Post('/public/add-avatar-profile/:profileId')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async addAvatarProfile(
    @Req() requestUser: RequestUser,
    @Param('profileId') profileId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.mediaService.addAvatarProfile(requestUser.user.id, profileId, {
      imageBuffer: file.buffer,
      fileName: file.originalname,
    });
  }

  @Post('/public/add-banner-company/:companyId')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async addBannerCompany(
    @Req() requestUser: RequestUser,
    @Param('companyId') companyId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.mediaService.addBannerCompany(requestUser.user.id, companyId, {
      imageBuffer: file.buffer,
      fileName: file.originalname,
    });
  }

  @Post('/public/add-banner-group/:groupId')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async addBannerGroup(
    @Req() requestUser: RequestUser,
    @Param('groupId') groupId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.mediaService.addBannerGroupMedia(requestUser.user.id, groupId, {
      imageBuffer: file.buffer,
      fileName: file.originalname,
    });
  }

  @Post('/public/add-banner-profile/:profileId')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async addBannerProfile(
    @Req() requestUser: RequestUser,
    @Param('profileId') profileId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.mediaService.addBannerProfile(requestUser.user.id, profileId, {
      imageBuffer: file.buffer,
      fileName: file.originalname,
    });
  }

  @Post('/public/add-card-media/:cardId')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async addCardMedia(
    @Req() requestUser: RequestUser,
    @Param('cardId') cardId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.mediaService.addCardMedia(requestUser.user.id, cardId, {
      imageBuffer: file.buffer,
      fileName: file.originalname,
    });
  }

  @Delete('/public/remove-media/:mediaId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async removeMedia(@Req() requestUser: RequestUser, @Param('mediaId') mediaId: string): Promise<void> {
    await this.mediaService.softRemoveMedia(requestUser.user.id, mediaId);
  }

  @Delete('/admin/remove-media/:mediaId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async removeMediaAdmin(@Param('mediaId') mediaId: string): Promise<void> {
    await this.mediaService.removeMediaAdmin(mediaId);
  }

  @Delete('/admin/restore-media/:mediaId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async restoreMediaAdmin(@Param('mediaId') mediaId: string): Promise<void> {
    await this.mediaService.restoreMediaAdmin(mediaId);
  }

  @Delete('/admin/soft-remove-media/:mediaId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async softRemoveMediaAdmin(@Param('mediaId') mediaId: string): Promise<void> {
    await this.mediaService.softRemoveMediaAdmin(mediaId);
  }
}

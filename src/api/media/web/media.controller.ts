import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from '../application/media.service';
import { RoleGuard } from '../../auth/web/guards/role.guard';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaResponse } from './response/media.response';
import { RequestUser } from '../../auth/domain/interface/request-user.interface';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('/public/get-media-with-id/:mediaId')
  async getMediaWithId(@Param('mediaId') mediaId: string): Promise<MediaResponse> {
    return await this.mediaService.getMediaWithId(mediaId);
  }

  @Get('/public/get-all-media')
  async getAllMedia(): Promise<MediaResponse[]> {
    return await this.mediaService.getAllMedia();
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

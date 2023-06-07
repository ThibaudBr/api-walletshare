import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { NewMediaDto } from '../domain/dto/new-media.dto';
import { UploadMediaCommand } from './cqrs/command/upload-media.command';
import { AddAvatarProfileMediaCommand } from './cqrs/command/add-avatar-profile-media.command';
import { RemoveMediaCommand } from './cqrs/command/remove-media.command';
import { GetMediaWithIdQuery } from './cqrs/query/get-media-with-id.query';
import { MediaResponse } from '../web/response/media.response';
import { GetAllMediaWithDeletedQuery } from './cqrs/query/get-all-media-with-deleted.query';
import { IsProfileOwnerWithUserIsQuery } from '../../card/application/cqrs/query/is-profile-owner-with-user-is.query';
import { ErrorCustomEvent } from '../../../util/exception/error-handler/error-custom.event';
import { IsUserIdOwnerOfMediaQuery } from './cqrs/query/is-user-id-owner-of-media.query';
import { InvalidIdHttpException } from '../../../util/exception/custom-http-exception/invalid-id.http-exception';
import { GetTemporaryMediaUrlQuery } from './cqrs/query/get-temporary-media-url.query';
import { IsRoleInCompanyQuery } from '../../company/application/cqrs/query/is-role-in-company.query';
import { RoleCompanyEmployeeEnum } from '../../company/domain/enum/role-company-employee.enum';
import { AddAvatarCompanyMediaCommand } from './cqrs/command/add-avatar-company-media.command';
import { IsUserIdHaveRoleInGroupQuery } from '../../groupe/application/cqrs/query/is-user-id-have-role-in-group.query';
import { RoleGroupMembershipEnum } from '../../groupe/domain/enum/role-group-membership.enum';
import { AddAvatarGroupMediaCommand } from './cqrs/command/add-avatar-group-media.command';
import { AddBannerGroupMediaCommand } from './cqrs/command/add-banner-group-media.command';
import { AddBannerCompanyMediaCommand } from './cqrs/command/add-banner-company-media.command';
import { AddBannerProfileMediaCommand } from './cqrs/command/add-banner-profile-media.command';
import { AddCardMediaCommand } from './cqrs/command/add-card-media.command';
import { IsCardOwnerWithUserIdQuery } from '../../card/application/cqrs/query/is-card-owner-with-user-id.query';
import { RestoreMediaCommand } from './cqrs/command/restore-media.command';
import { SoftRemoveMediaCommand } from './cqrs/command/soft-remove-media.command';
import { AddCardPresetMediaCommand } from './cqrs/command/add-card-preset-media.command';

@Injectable()
export class MediaService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {}

  async getMediaWithId(mediaId: string): Promise<MediaResponse> {
    return await this.queryBus
      .execute(new GetMediaWithIdQuery({ mediaId: mediaId }))
      .catch(async error => {
        if (error.message === 'Media not found') throw new InvalidIdHttpException('Media not found');
        throw error;
      })
      .then(async (media: MediaResponse) => {
        media.url = await this.queryBus.execute(new GetTemporaryMediaUrlQuery({ mediaKey: media.key }));
        return media;
      });
  }

  async getAllMedia(): Promise<MediaResponse[]> {
    return await this.queryBus.execute(new GetAllMediaWithDeletedQuery()).catch(async error => {
      if (error.message === 'Media not found') throw new InvalidIdHttpException('Media not found');
      throw error;
    });
  }

  async addAvatarCompany(userId: string, companyId: string, newMediaDto: NewMediaDto): Promise<void> {
    if (
      !(await this.queryBus.execute(
        new IsRoleInCompanyQuery({
          companyId: companyId,
          userId: userId,
          roles: [RoleCompanyEmployeeEnum.OWNER, RoleCompanyEmployeeEnum.ADMIN],
        }),
      ))
    ) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddAvatarCompanyCommandHandler',
          localisation: 'IsRoleInCompanyQuery',
          error: 'User is not owner or admin of company',
        }),
      );
      throw new ForbiddenException('User is not owner or admin of company');
    }

    const newMedia = await this.commandBus
      .execute(
        new UploadMediaCommand({
          dataBuffer: newMediaDto.imageBuffer,
          filename: newMediaDto.fileName,
        }),
      )
      .catch(async error => {
        if (error.message === 'File is too big') throw new BadRequestException('File is too big');
        throw error;
      });

    await this.commandBus
      .execute(
        new AddAvatarCompanyMediaCommand({
          companyId: companyId,
          mediaEntity: newMedia,
        }),
      )
      .catch(async error => {
        await this.commandBus.execute(new RemoveMediaCommand({ mediaId: newMedia.id }));
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        throw error;
      });
  }

  async addAvatarGroupMedia(userId: string, groupId: string, newMediaDto: NewMediaDto): Promise<void> {
    if (
      !(await this.queryBus.execute(
        new IsUserIdHaveRoleInGroupQuery({
          groupId: groupId,
          userId: userId,
          roles: [RoleGroupMembershipEnum.OWNER, RoleGroupMembershipEnum.ADMIN],
        }),
      ))
    ) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddAvatarGroupCommandHandler',
          localisation: 'IsUserIdHaveRoleInGroupQuery',
          error: 'User is not owner or admin of group',
        }),
      );
      throw new ForbiddenException('User is not owner or admin of group');
    }

    const newMedia = await this.commandBus
      .execute(
        new UploadMediaCommand({
          dataBuffer: newMediaDto.imageBuffer,
          filename: newMediaDto.fileName,
        }),
      )
      .catch(async error => {
        if (error.message === 'File is too big') throw new BadRequestException('File is too big');
        throw error;
      });

    await this.commandBus
      .execute(
        new AddAvatarGroupMediaCommand({
          groupId: groupId,
          mediaEntity: newMedia,
        }),
      )
      .catch(async error => {
        await this.commandBus.execute(new RemoveMediaCommand({ mediaId: newMedia.id }));
        if (error.message === 'Group not found') throw new InvalidIdHttpException('Group not found');
        throw error;
      });
  }

  async addAvatarProfile(userId: string, profileId: string, newMediaDto: NewMediaDto): Promise<void> {
    if (
      !(await this.queryBus.execute(
        new IsProfileOwnerWithUserIsQuery({
          userId: userId,
          profileId: profileId,
        }),
      ))
    ) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddAvatarProfileCommandHandler',
          localisation: 'IsProfileOwnerWithUserIsQuery',
          error: 'User is not owner of profile',
        }),
      );
      throw new ForbiddenException('User is not owner of profile');
    }
    const newMedia = await this.commandBus
      .execute(
        new UploadMediaCommand({
          dataBuffer: newMediaDto.imageBuffer,
          filename: newMediaDto.fileName,
        }),
      )
      .catch(async error => {
        if (error.message === 'File is too big') throw new BadRequestException('File is too big');
        throw error;
      });

    await this.commandBus
      .execute(
        new AddAvatarProfileMediaCommand({
          profileId: profileId,
          mediaEntity: newMedia,
        }),
      )
      .catch(async error => {
        await this.commandBus.execute(new RemoveMediaCommand({ mediaId: newMedia.id }));
        if (error.message === 'Profile not found') throw new InvalidIdHttpException('Profile not found');
        throw error;
      });
  }

  async addBannerCompany(userId: string, companyId: string, newMediaDto: NewMediaDto): Promise<void> {
    if (
      !(await this.queryBus.execute(
        new IsRoleInCompanyQuery({
          companyId: companyId,
          userId: userId,
          roles: [RoleCompanyEmployeeEnum.OWNER, RoleCompanyEmployeeEnum.ADMIN],
        }),
      ))
    ) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddBannerCompanyCommandHandler',
          localisation: 'IsRoleInCompanyQuery',
          error: 'User is not owner or admin of company',
        }),
      );
      throw new ForbiddenException('User is not owner or admin of company');
    }

    const newMedia = await this.commandBus
      .execute(
        new UploadMediaCommand({
          dataBuffer: newMediaDto.imageBuffer,
          filename: newMediaDto.fileName,
        }),
      )
      .catch(async error => {
        if (error.message === 'File is too big') throw new BadRequestException('File not found');
        throw error;
      });

    await this.commandBus
      .execute(
        new AddBannerCompanyMediaCommand({
          companyId: companyId,
          mediaEntity: newMedia,
        }),
      )
      .catch(async error => {
        await this.commandBus.execute(new RemoveMediaCommand({ mediaId: newMedia.id }));
        if (error.message === 'Company not found') throw new InvalidIdHttpException('Company not found');
        throw error;
      });
  }

  async addBannerGroupMedia(userId: string, groupId: string, newMediaDto: NewMediaDto): Promise<void> {
    if (
      !(await this.queryBus.execute(
        new IsUserIdHaveRoleInGroupQuery({
          groupId: groupId,
          userId: userId,
          roles: [RoleGroupMembershipEnum.OWNER, RoleGroupMembershipEnum.ADMIN],
        }),
      ))
    ) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddBannerGroupCommandHandler',
          localisation: 'IsUserIdHaveRoleInGroupQuery',
          error: 'User is not owner or admin of group',
        }),
      );
      throw new ForbiddenException('User is not owner or admin of group');
    }

    const newMedia = await this.commandBus
      .execute(
        new UploadMediaCommand({
          dataBuffer: newMediaDto.imageBuffer,
          filename: newMediaDto.fileName,
        }),
      )
      .catch(async error => {
        if (error.message === 'File is too big') throw new BadRequestException('File is too big');
        throw error;
      });

    await this.commandBus
      .execute(
        new AddBannerGroupMediaCommand({
          groupId: groupId,
          mediaEntity: newMedia,
        }),
      )
      .catch(async error => {
        await this.commandBus.execute(new RemoveMediaCommand({ mediaId: newMedia.id }));
        if (error.message === 'Group not found') throw new InvalidIdHttpException('Group not found');
        throw error;
      });
  }

  async addBannerProfile(userId: string, profileId: string, newMediaDto: NewMediaDto): Promise<void> {
    if (
      !(await this.queryBus.execute(
        new IsProfileOwnerWithUserIsQuery({
          userId: userId,
          profileId: profileId,
        }),
      ))
    ) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddBannerProfileCommandHandler',
          localisation: 'IsProfileOwnerWithUserIsQuery',
          error: 'User is not owner of profile',
        }),
      );
      throw new ForbiddenException('User is not owner of profile');
    }

    const newMedia = await this.commandBus
      .execute(
        new UploadMediaCommand({
          dataBuffer: newMediaDto.imageBuffer,
          filename: newMediaDto.fileName,
        }),
      )
      .catch(async error => {
        if (error.message === 'File is too big') throw new BadRequestException('File is too big');
        throw error;
      });

    await this.commandBus
      .execute(
        new AddBannerProfileMediaCommand({
          profileId: profileId,
          mediaEntity: newMedia,
        }),
      )
      .catch(async error => {
        await this.commandBus.execute(new RemoveMediaCommand({ mediaId: newMedia.id }));
        if (error.message === 'Profile not found') throw new InvalidIdHttpException('Profile not found');
        throw error;
      });
  }

  async addCardPresetMedia(
    userId: string,
    companyId: string,
    cardPresetId: string,
    newMediaDto: NewMediaDto,
  ): Promise<void> {
    if (
      !(await this.queryBus.execute(
        new IsRoleInCompanyQuery({
          companyId: companyId,
          userId: userId,
          roles: [RoleCompanyEmployeeEnum.OWNER, RoleCompanyEmployeeEnum.ADMIN],
        }),
      ))
    ) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddCardPresetMediaCommandHandler',
          localisation: 'IsRoleInCompanyQuery',
          error: 'User is not owner or admin of company',
        }),
      );
      throw new ForbiddenException('User is not owner or admin of company');
    }

    const newMedia = await this.commandBus
      .execute(
        new UploadMediaCommand({
          dataBuffer: newMediaDto.imageBuffer,
          filename: newMediaDto.fileName,
        }),
      )
      .catch(async error => {
        if (error.message === 'File is too big') throw new BadRequestException('File not found');
        throw error;
      });

    await this.commandBus
      .execute(
        new AddCardPresetMediaCommand({
          cardPresetId: cardPresetId,
          mediaEntity: newMedia,
        }),
      )
      .catch(async error => {
        await this.commandBus.execute(new RemoveMediaCommand({ mediaId: newMedia.id }));
        if (error.message === 'Card not found') throw new InvalidIdHttpException('Card not found');
        throw error;
      });
  }

  async addCardMedia(userId: string, cardId: string, newMediaDto: NewMediaDto): Promise<void> {
    if (
      !(await this.queryBus.execute(
        new IsCardOwnerWithUserIdQuery({
          userId: userId,
          cardId: cardId,
        }),
      ))
    ) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddCardMediaCommandHandler',
          localisation: 'IsCardOwnerWithUserIdQuery',
          error: 'User is not owner of card',
        }),
      );
      throw new ForbiddenException('User is not owner of card');
    }

    const newMedia = await this.commandBus
      .execute(
        new UploadMediaCommand({
          dataBuffer: newMediaDto.imageBuffer,
          filename: newMediaDto.fileName,
        }),
      )
      .catch(async error => {
        if (error.message === 'File is too big') throw new BadRequestException('File is too big');
        throw error;
      });

    await this.commandBus
      .execute(
        new AddCardMediaCommand({
          cardId: cardId,
          mediaEntity: newMedia,
        }),
      )
      .catch(async error => {
        await this.commandBus.execute(new RemoveMediaCommand({ mediaId: newMedia.id }));
        if (error.message === 'Card not found') throw new InvalidIdHttpException('Card not found');
        throw error;
      });
  }

  async softRemoveMedia(userId: string, mediaId: string): Promise<void> {
    if (
      !(await this.queryBus.execute(
        new IsUserIdOwnerOfMediaQuery({
          userId: userId,
          mediaId: mediaId,
        }),
      ))
    )
      throw new ForbiddenException('User is not owner of media');

    await this.commandBus.execute(new RemoveMediaCommand({ mediaId: mediaId })).catch(async error => {
      if (error.message === 'Media not found') throw new Error('Media not found');
      throw error;
    });
  }

  async removeMediaAdmin(mediaId: string): Promise<void> {
    await this.commandBus.execute(new RemoveMediaCommand({ mediaId: mediaId })).catch(async error => {
      if (error.message === 'Media not found') throw new Error('Media not found');
      throw error;
    });
  }

  async restoreMediaAdmin(mediaId: string): Promise<void> {
    await this.commandBus.execute(new RestoreMediaCommand({ mediaId: mediaId })).catch(async error => {
      if (error.message === 'Media not found') throw new Error('Media not found');
      throw error;
    });
  }

  async softRemoveMediaAdmin(mediaId: string): Promise<void> {
    await this.commandBus.execute(new SoftRemoveMediaCommand({ mediaId: mediaId })).catch(async error => {
      if (error.message === 'Media not found') throw new Error('Media not found');
      throw error;
    });
  }
}

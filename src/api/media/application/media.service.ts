import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { NewMediaDto } from '../domain/dto/new-media.dto';
import { UploadMediaCommand } from './cqrs/command/upload-media.command';
import { AddAvatarProfileCommand } from './cqrs/command/add-avatar-profile.command';
import { RemoveMediaCommand } from './cqrs/command/remove-media.command';
import { GetMediaWithIdQuery } from './cqrs/query/get-media-with-id.query';
import { MediaResponse } from '../web/response/media.response';
import { GetAllMediaWithDeletedQuery } from './cqrs/query/get-all-media-with-deleted.query';
import { IsProfileOwnerWithUserIsQuery } from '../../card/application/cqrs/query/is-profile-owner-with-user-is.query';
import { ErrorCustomEvent } from '../../../util/exception/error-handler/error-custom.event';
import { IsUserIdOwnerOfMediaQuery } from './cqrs/query/is-user-id-owner-of-media.query';
import { InvalidIdHttpException } from '../../../util/exception/custom-http-exception/invalid-id.http-exception';
import { MediaEntity } from '../domain/entities/media.entity';
import { GetTemporaryMediaUrlQuery } from './cqrs/query/get-temporary-media-url.query';

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
    const newMedia = await this.commandBus.execute(
      new UploadMediaCommand({
        dataBuffer: newMediaDto.imageBuffer,
        filename: newMediaDto.fileName,
      }),
    );

    await this.commandBus
      .execute(
        new AddAvatarProfileCommand({
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
    await this.commandBus.execute(new RemoveMediaCommand({ mediaId: mediaId })).catch(async error => {
      if (error.message === 'Media not found') throw new Error('Media not found');
      throw error;
    });
  }

  async softRemoveMediaAdmin(mediaId: string): Promise<void> {
    await this.commandBus.execute(new RemoveMediaCommand({ mediaId: mediaId })).catch(async error => {
      if (error.message === 'Media not found') throw new Error('Media not found');
      throw error;
    });
  }
}

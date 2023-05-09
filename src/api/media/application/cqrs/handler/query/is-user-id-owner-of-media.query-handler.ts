import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IsUserIdOwnerOfMediaQuery } from '../../query/is-user-id-owner-of-media.query';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from '../../../../domain/entities/media.entity';
import { RoleGroupMembershipEnum } from '../../../../../groupe/domain/enum/role-group-membership.enum';

@QueryHandler(IsUserIdOwnerOfMediaQuery)
export class IsUserIdOwnerOfMediaQueryHandler implements IQueryHandler<IsUserIdOwnerOfMediaQuery> {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: IsUserIdOwnerOfMediaQuery): Promise<boolean> {
    const media = await this.mediaRepository
      .findOneOrFail({
        relations: [
          'avatarGroupMedia',
          'bannerGroupMedia',
          'avatarGroupMedia.members',
          'bannerGroupMedia.members',
          'avatarGroupMedia.members.card',
          'bannerGroupMedia.members.card',
          'avatarGroupMedia.members.card.owner',
          'bannerGroupMedia.members.card.owner',
          'avatarGroupMedia.members.card.owner.user',
          'bannerGroupMedia.members.card.owner.user',
          'avatarProfileMedia',
          'bannerProfileMedia',
          'avatarProfileMedia.user',
          'bannerProfileMedia.user',
          'cardMedia',
          'cardMedia.owner',
          'cardMedia.owner.user',
          'avatarCompanyMedia',
          'bannerCompanyMedia',
          'avatarCompanyMedia.ownerProfile',
          'bannerCompanyMedia.ownerProfile',
          'avatarCompanyMedia.ownerProfile.user',
          'bannerCompanyMedia.ownerProfile.user',
        ],
        where: {
          id: query.mediaId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetMediaWithIdQueryHandler',
            localisation: 'MediaRepository.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('Media not found');
      });

    if (!this.isUserOwnerOfMedia(media, query.userId)) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'IsUserIdOwnerOfMediaQueryHandler',
          localisation: 'IsUserIdOwnerOfMediaQueryHandler.execute',
          error: 'User is not owner of media',
        }),
      );
      return false;
    }

    return true;
  }

  private isUserOwnerOfMedia(media: MediaEntity, userId: string): boolean {
    if (media.avatarGroupMedia) {
      return this.isUserOwnerOfGroupMedia(media, userId);
    } else if (media.bannerGroupMedia) {
      return this.isUserOwnerOfBannerGroupMedia(media, userId);
    } else if (media.avatarProfileMedia) {
      return this.isUserOwnerOfAvatarProfileMedia(media, userId);
    } else if (media.bannerProfileMedia) {
      return this.isUserOwnerOfBannerProfileMedia(media, userId);
    } else if (media.cardMedia) {
      return this.isUserOwnerOfCardMedia(media, userId);
    } else if (media.avatarCompanyMedia) {
      return this.isUserOwnerOfAvatarCompanyMedia(media, userId);
    } else if (media.bannerCompanyMedia) {
      return this.isUserOwnerOfBannerCompanyMedia(media, userId);
    }
    return false;
  }

  private isUserOwnerOfGroupMedia(media: MediaEntity, userId: string): boolean {
    for (const member of media.avatarGroupMedia.members) {
      if (member.card.owner.user.id === userId) {
        return member.role === RoleGroupMembershipEnum.OWNER || member.role === RoleGroupMembershipEnum.ADMIN;
      }
    }
    return false;
  }

  private isUserOwnerOfBannerGroupMedia(media: MediaEntity, userId: string): boolean {
    for (const member of media.bannerGroupMedia.members) {
      if (member.card.owner.user.id === userId) {
        return member.role === RoleGroupMembershipEnum.OWNER || member.role === RoleGroupMembershipEnum.ADMIN;
      }
    }
    return false;
  }

  private isUserOwnerOfAvatarProfileMedia(media: MediaEntity, userId: string): boolean {
    return media.avatarProfileMedia.user.id === userId;
  }

  private isUserOwnerOfBannerProfileMedia(media: MediaEntity, userId: string): boolean {
    return media.bannerProfileMedia.user.id === userId;
  }

  private isUserOwnerOfCardMedia(media: MediaEntity, userId: string): boolean {
    return media.cardMedia.owner.user.id === userId;
  }

  private isUserOwnerOfAvatarCompanyMedia(media: MediaEntity, userId: string): boolean {
    return media.avatarCompanyMedia.ownerProfile.user.id === userId;
  }

  private isUserOwnerOfBannerCompanyMedia(media: MediaEntity, userId: string): boolean {
    return media.bannerCompanyMedia.ownerProfile.user.id === userId;
  }
}

import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import { MediaEntity } from '../../domain/entities/media.entity';
import { S3 } from '@aws-sdk/client-s3';

@EventSubscriber()
export class ProfileMediaSubscriber implements EntitySubscriberInterface<ProfileEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return ProfileEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<ProfileEntity>): Promise<void> {
    const softRemovedProfile: ProfileEntity | undefined = event.entity;
    const mediaRepository: Repository<MediaEntity> = event.manager.getRepository(MediaEntity);
    const medias: MediaEntity[] = await mediaRepository
      .createQueryBuilder('media')
      .setFindOptions({ loadEagerRelations: false })
      .leftJoinAndSelect('media.avatarProfileMedia', 'avatarProfileMedia')
      .leftJoinAndSelect('media.bannerProfileMedia', 'bannerProfileMedia')
      .where('avatarProfileMedia.id = :id', { id: softRemovedProfile?.avatarMedia?.id })
      .orWhere('bannerProfileMedia.id = :id', { id: softRemovedProfile?.bannerMedia?.id })
      .getMany();

    if (medias.length == 0) return;
    await mediaRepository.softRemove(medias);
  }

  async beforeRemove(event: RemoveEvent<ProfileEntity>): Promise<void> {
    const softRemovedProfile: ProfileEntity | undefined = event.entity;
    const mediaRepository: Repository<MediaEntity> = event.manager.getRepository(MediaEntity);
    const medias: MediaEntity[] = await mediaRepository
      .createQueryBuilder('media')
      .setFindOptions({ loadEagerRelations: false, withDeleted: true })
      .leftJoinAndSelect('media.avatarProfileMedia', 'avatarProfileMedia')
      .leftJoinAndSelect('media.bannerProfileMedia', 'bannerProfileMedia')
      .where('avatarProfileMedia.id = :id', { id: softRemovedProfile?.avatarMedia?.id })
      .orWhere('bannerProfileMedia.id = :id', { id: softRemovedProfile?.bannerMedia?.id })
      .getMany();
    if (medias.length == 0) return;
    const s3: S3 = new S3({
      region: process.env.AWS_REGION,
    });
    if (!process.env.AWS_PRIVATE_BUCKET_NAME) {
      throw new Error('AWS_PRIVATE_BUCKET_NAME is not defined');
    }
    for (const media of medias) {
      await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME || '',
        Key: media.key,
      });
    }
    await mediaRepository.remove(medias);
  }
}

import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository } from 'typeorm';
import { GroupEntity } from '../../../groupe/domain/entities/group.entity';
import { MediaEntity } from '../../domain/entities/media.entity';
import { S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@EventSubscriber()
export class GroupMediaSubscriber implements EntitySubscriberInterface<GroupEntity> {
  constructor(private readonly configService: ConfigService) {}
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return GroupEntity;
  }

  async beforeRemove(event: RemoveEvent<GroupEntity>): Promise<void> {
    const removedGroup: GroupEntity | undefined = event.entity;
    const mediaRepository: Repository<MediaEntity> = event.manager.getRepository(MediaEntity);
    const medias: MediaEntity[] = await mediaRepository.find({
      relations: ['avatarGroupMedia', 'bannerGroupMedia'],
      withDeleted: true,
      where: [
        {
          avatarGroupMedia: {
            id: removedGroup?.id,
          },
        },
        {
          bannerGroupMedia: {
            id: removedGroup?.id,
          },
        },
      ],
    });
    if (medias.length == 0) return;
    const s3: S3 = new S3({
      region: this.configService.get('AWS_REGION'),
    });
    if (!this.configService.get('AWS_PRIVATE_BUCKET_NAME')) {
      throw new Error('AWS_PRIVATE_BUCKET_NAME is not defined');
    }
    for (const media of medias) {
      await s3.deleteObject({
        Bucket: this.configService.get('AWS_BUCKET_NAME') ?? '',
        Key: media.key,
      });
    }
    await mediaRepository.remove(medias);
  }

  async beforeSoftRemove(event: RemoveEvent<GroupEntity>): Promise<void> {
    const removedGroup: GroupEntity | undefined = event.entity;
    const mediaRepository: Repository<MediaEntity> = event.manager.getRepository(MediaEntity);
    const medias: MediaEntity[] = await mediaRepository.find({
      relations: ['avatarGroupMedia', 'bannerGroupMedia'],
      where: [
        {
          avatarGroupMedia: {
            id: removedGroup?.avatarMedia?.id,
          },
        },
        {
          bannerGroupMedia: {
            id: removedGroup?.bannerMedia?.id,
          },
        },
      ],
    });
    if (medias.length == 0) return;
    await mediaRepository.softRemove(medias);
  }
}

import { EntitySubscriberInterface, EventSubscriber, Repository, SoftRemoveEvent } from 'typeorm';
import { CardEntity } from '../../../card/domain/entities/card.entity';
import { MediaEntity } from '../../domain/entities/media.entity';
import { S3 } from 'aws-sdk';
import process from 'process';

@EventSubscriber()
export class CardMediaSubscriber implements EntitySubscriberInterface<CardEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return CardEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<CardEntity>): Promise<void> {
    const softRemovedCard: CardEntity | undefined = event.entity;
    const mediaRepository: Repository<MediaEntity> = event.manager.getRepository(MediaEntity);
    const medias: MediaEntity[] = await mediaRepository.find({
      loadEagerRelations: false,
      relations: ['cardMedia'],
      where: [
        {
          cardMedia: {
            id: softRemovedCard?.media?.id,
          },
        },
      ],
    });
    if (medias.length == 0) return;
    await mediaRepository.softRemove(medias);
  }

  async beforeRemove(event: SoftRemoveEvent<CardEntity>): Promise<void> {
    const softRemovedCard: CardEntity | undefined = event.entity;
    const mediaRepository: Repository<MediaEntity> = event.manager.getRepository(MediaEntity);
    const medias: MediaEntity[] = await mediaRepository.find({
      loadEagerRelations: false,
      relations: ['cardMedia'],
      withDeleted: true,
      where: [
        {
          cardMedia: {
            id: softRemovedCard?.media?.id,
          },
        },
      ],
    });
    if (medias.length == 0) return;
    const s3: S3 = new S3();
    if (!process.env.AWS_PRIVATE_BUCKET_NAME) {
      throw new Error('AWS_PRIVATE_BUCKET_NAME is not defined');
    }
    for (const media of medias) {
      await s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME || '',
          Key: media.key,
        })
        .promise();
    }
    await mediaRepository.remove(medias);
  }
}

import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository } from 'typeorm';
import { CardPresetEntity } from '../../../company/domain/entities/card-preset.entity';
import { MediaEntity } from '../../domain/entities/media.entity';
import { S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import process from 'process';

@EventSubscriber()
export class CardPresetMediaSubscriber implements EntitySubscriberInterface<CardPresetEntity> {
  constructor(private readonly configService: ConfigService) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return CardPresetEntity;
  }

  async beforeRemove(event: RemoveEvent<CardPresetEntity>): Promise<void> {
    const removeCardPreset: CardPresetEntity | undefined = event.entity;
    const mediaRepository: Repository<MediaEntity> = event.manager.getRepository(MediaEntity);
    const medias: MediaEntity[] = await mediaRepository.find({
      relations: {
        cardPresetMedia: true,
      },
      withDeleted: true,
      where: {
        cardPresetMedia: {
          id: removeCardPreset?.id,
        },
      },
    });
    if (medias.length == 0) return;
    const s3: S3 = new S3({
      region: process.env.AWS_REGION,
    });
    if (!process.env.AWS_PRIVATE_BUCKET_NAME) {
      throw new Error('AWS_PRIVATE_BUCKET_NAME is not defined');
    }
    for (const media of medias) {
      await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME ?? '',
        Key: media.key,
      });
    }
    await mediaRepository.remove(medias).catch(error => {
      console.log(error);
    });
  }
}

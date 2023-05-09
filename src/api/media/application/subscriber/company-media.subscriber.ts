import { EntitySubscriberInterface, EventSubscriber, Repository, SoftRemoveEvent } from 'typeorm';
import { CompanyEntity } from '../../../company/domain/entities/company.entity';
import { MediaEntity } from '../../domain/entities/media.entity';
import process from 'process';
import { S3 } from '@aws-sdk/client-s3';

@EventSubscriber()
export class CompanyMediaSubscriber implements EntitySubscriberInterface<CompanyEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return CompanyEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<CompanyEntity>): Promise<void> {
    const softRemovedCompany: CompanyEntity | undefined = event.entity;
    const mediaRepository: Repository<MediaEntity> = event.manager.getRepository(MediaEntity);
    const medias: MediaEntity[] = await mediaRepository.find({
      loadEagerRelations: false,
      relations: ['avatarCompanyMedia', 'bannerCompanyMedia'],
      where: [
        {
          avatarCompanyMedia: {
            id: softRemovedCompany?.avatarMedia?.id,
          },
        },
        {
          bannerCompanyMedia: {
            id: softRemovedCompany?.bannerMedia?.id,
          },
        },
      ],
    });
    if (medias.length == 0) return;
    await mediaRepository.softRemove(medias);
  }

  async beforeRemove(event: SoftRemoveEvent<CompanyEntity>): Promise<void> {
    const softRemovedCompany: CompanyEntity | undefined = event.entity;
    const mediaRepository: Repository<MediaEntity> = event.manager.getRepository(MediaEntity);
    const medias: MediaEntity[] = await mediaRepository.find({
      loadEagerRelations: false,
      relations: ['avatarCompanyMedia', 'bannerCompanyMedia'],
      withDeleted: true,
      where: [
        {
          avatarCompanyMedia: {
            id: softRemovedCompany?.avatarMedia?.id,
          },
        },
        {
          bannerCompanyMedia: {
            id: softRemovedCompany?.bannerMedia?.id,
          },
        },
      ],
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
        Bucket: process.env.AWS_BUCKET_NAME || '',
        Key: media.key,
      });
    }
    await mediaRepository.remove(medias);
  }
}

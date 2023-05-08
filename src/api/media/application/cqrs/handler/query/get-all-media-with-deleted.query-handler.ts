import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllMediaWithDeletedQuery } from '../../query/get-all-media-with-deleted.query';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from '../../../../domain/entities/media.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllMediaWithDeletedQuery)
export class GetAllMediaWithDeletedQueryHandler implements IQueryHandler<GetAllMediaWithDeletedQuery> {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<MediaEntity[]> {
    return await this.mediaRepository
      .find({
        withDeleted: true,
        relations: [
          'avatarGroupMedia',
          'bannerGroupMedia',
          'avatarProfileMedia',
          'bannerProfileMedia',
          'cardMedia',
          'avatarCompanyMedia',
          'bannerCompanyMedia',
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetAllMediaWithDeletedQueryHandler',
            localisation: 'MediaRepository.find',
            error: error,
          }),
        );
        throw new Error('Media not found');
      });
  }
}

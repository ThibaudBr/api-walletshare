import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMediaWithIdQuery } from '../../query/get-media-with-id.query';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from '../../../../domain/entities/media.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetMediaWithIdQuery)
export class GetMediaWithIdQueryHandler implements IQueryHandler<GetMediaWithIdQuery> {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetMediaWithIdQuery): Promise<MediaEntity> {
    return await this.mediaRepository
      .findOneOrFail({
        loadEagerRelations: false,
        relations: [
          'avatarGroupMedia',
          'bannerGroupMedia',
          'avatarProfileMedia',
          'bannerProfileMedia',
          'cardMedia',
          'avatarCompanyMedia',
          'bannerCompanyMedia',
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
  }
}

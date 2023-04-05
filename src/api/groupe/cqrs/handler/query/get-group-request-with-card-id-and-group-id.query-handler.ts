import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { Repository } from 'typeorm';
import { GetGroupRequestWithCardIdAndGroupIdQuery } from '../../query/get-group-request-with-card-id-and-group-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRequestEntity } from '../../../domain/entities/group-request.entity';

@QueryHandler(GetGroupRequestWithCardIdAndGroupIdQuery)
export class GetGroupRequestWithCardIdAndGroupIdQueryHandler
  implements IQueryHandler<GetGroupRequestWithCardIdAndGroupIdQuery>
{
  constructor(
    @InjectRepository(GroupRequestEntity)
    private readonly groupRequestRepository: Repository<GroupRequestEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetGroupRequestWithCardIdAndGroupIdQuery): Promise<GroupRequestEntity> {
    return await this.groupRequestRepository
      .findOneOrFail({
        relations: ['group', 'card'],
        where: [
          {
            card: {
              id: query.cardId,
            },
            group: {
              id: query.groupId,
            },
          },
        ],
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'GetGroupRequestWithCardIdAndGroupIdQueryHandler',
            error: error.message,
          }),
        );
        throw new Error('Invalid id');
      });
  }
}

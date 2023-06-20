import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { Repository } from 'typeorm';
import { GetGroupByIdQuery } from '../../query/get-group-by-id.query';
import { InjectRepository } from '@nestjs/typeorm';

@QueryHandler(GetGroupByIdQuery)
export class GetGroupByIdQueryHandler implements IQueryHandler<GetGroupByIdQuery> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetGroupByIdQuery): Promise<GroupEntity> {
    return await this.groupRepository
      .findOneOrFail({
        relations: ['members', 'members.card', 'members.card.owner', 'members.card.owner.user'],
        where: [
          {
            id: query.groupId,
          },
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'groupRepository.findOneOrFail',
            handler: 'GetGroupByIdQueryHandler',
            error: error.message,
          }),
        );
        throw new Error('Invalid id');
      });
  }
}

import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllGroupQuery } from '../../query/get-all-group.query';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllGroupQuery)
export class GetAllGroupQueryHandler implements IQueryHandler<GetAllGroupQuery> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<GroupEntity[]> {
    return await this.groupRepository
      .find({
        relations: ['members', 'members.card', 'members.card.owner', 'members.card.owner.user'],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'groupRepository.find',
            handler: 'GetAllGroupQueryHandler',
            error: error.message,
          }),
        );
        throw error;
      });
  }
}

import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../../query/get-user-by-id.query';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<UserEntity> {
    return await this.userRepository
      .findOneOrFail({
        relations: ['profiles'],
        where: {
          id: query.userId,
        },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetUserByIdQueryHandler',
            localisation: 'userRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw new Error('User not found');
      });
  }
}

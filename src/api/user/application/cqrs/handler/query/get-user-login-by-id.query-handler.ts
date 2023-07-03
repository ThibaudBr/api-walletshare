import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { Repository } from 'typeorm';
import { UserLoginEntity } from '../../../../domain/entities/user-login.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUserLoginByUserIdQuery } from '../../query/get-user-login-by-user-id.query';

@QueryHandler(GetUserLoginByUserIdQuery)
export class GetUserLoginByIdQueryHandler implements IQueryHandler<GetUserLoginByUserIdQuery> {
  constructor(
    @InjectRepository(UserLoginEntity)
    private readonly userLoginRepository: Repository<UserLoginEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetUserLoginByUserIdQuery): Promise<UserLoginEntity> {
    return await this.userLoginRepository
      .findOneOrFail({
        where: {
          id: query.userId,
        },
        relations: ['user'],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetUserLoginByIdQueryHandler',
            error: error.message,
            localisation: 'userLoginRepository.findOneOrFail',
          }),
        );
        throw new Error('User login not found');
      });
  }
}

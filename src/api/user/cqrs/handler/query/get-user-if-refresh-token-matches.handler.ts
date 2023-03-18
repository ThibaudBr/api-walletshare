import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserIfRefreshTokenMatchesQuery } from '../../query/get-user-if-refresh-token-matches.query';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetUserIfRefreshTokenMatchesQuery)
export class GetUserIfRefreshTokenMatchesHandler implements IQueryHandler<GetUserIfRefreshTokenMatchesQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private eventBus: EventBus,
  ) {}

  async execute(query: GetUserIfRefreshTokenMatchesQuery): Promise<UserEntity | undefined> {
    try {
      const user = await this.userRepository.findOne({
        select: ['id', 'username', 'email', 'currentHashedRefreshToken'],
        where: {
          id: query.userId,
        },
      });

      const isRefreshTokenMatching = await bcrypt.compare(query.refreshToken, user?.currentHashedRefreshToken || '');

      if (isRefreshTokenMatching && user) {
        return user;
      }
    } catch (error) {
      this.eventBus.publish(new ErrorCustomEvent('user', 'GetUserIfRefreshTokenMatchesHandler', error));
    }
  }
}
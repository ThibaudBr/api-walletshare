import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserLoginQuery } from '../../query/get-user-login.query';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { config } from 'dotenv';

config();
@QueryHandler(GetUserLoginQuery)
export class GetUserLoginHandler implements IQueryHandler<GetUserLoginQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private eventBus: EventBus,
  ) {}

  async execute(query: GetUserLoginQuery): Promise<UserEntity> {
    try {
      const userUsername = await this.userRepository.findOneOrFail({
        where: [{ username: query.username }],
        select: ['id', 'username', 'password'],
      });

      if (userUsername) {
        return userUsername;
      } else {
        const userUsername = await this.userRepository.findOneOrFail({
          where: [{ email: query.username }],
          select: ['id', 'email', 'password'],
        });
        if (userUsername) {
          return userUsername;
        } else {
          throw 'Error: no match found';
        }
      }
    } catch (error) {
      throw 'Error: no match found';
    }
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { GetUserByUsernameQuery } from '../../query/get-user-by-username.query';

@QueryHandler(GetUserByUsernameQuery)
export class GetUserByUsernameQueryHandler implements IQueryHandler<GetUserByUsernameQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserByUsernameQuery): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: [{ username: query.username }],
        select: ['id', 'username', 'password', 'userRoles', 'createdAt', 'updatedAt'],
      });
    } catch (error) {
      throw 'Error: no match found';
    }
  }
}

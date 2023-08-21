import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { GetUserByUsernameQuery } from '../../query/get-user-by-username.query';

@QueryHandler(GetUserByUsernameQuery)
export class GetUserByUsernameQueryHandler implements IQueryHandler<GetUserByUsernameQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserByUsernameQuery): Promise<UserEntity | null> {
    try {
      return await this.userRepository.findOne({
        where: [{ username: query.username }],
        select: ['id', 'username', 'password', 'roles', 'createdAt', 'updatedAt'],
      });
    } catch (error) {
      throw new Error('no match found');
    }
  }
}

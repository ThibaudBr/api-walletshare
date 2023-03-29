import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../../query/get-user.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserResponse } from '../../../domain/response/user.response';
import { UserListResponse } from '../../../domain/response/user-list.response';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserQuery): Promise<UserResponse | UserResponse[]> {
    if (query.userId) {
      return {
        ...(await this.userRepository.findOneOrFail({
          where: [{ id: query.userId }],
        })),
      };
    }
    const userListResponse: UserListResponse = new UserListResponse();
    await this.userRepository.find().then(userList => {
      userList.forEach(user => {
        userListResponse.userList.push(new UserResponse({ ...user }));
      });
    });
    return userListResponse.userList;
  }
}

import { UserEntity } from '../../../../domain/entities/user.entity';
import { GetUserByEmailQuery } from '../../query/get-user-by-email.query';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailQueryHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserByEmailQuery): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: [{ mail: query.email }],
        select: ['id', 'mail', 'password', 'roles', 'createdAt', 'updatedAt'],
      });
    } catch (error) {
      throw 'Error: no match found';
    }
  }
}

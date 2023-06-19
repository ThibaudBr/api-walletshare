import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserEntityQuery } from '../../query/get-user-entity.query';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(GetUserEntityQuery)
export class GetUserEntityQueryHandler implements IQueryHandler<GetUserEntityQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserEntityQuery): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      relations: ['profiles', 'connection'],
      where: { id: query.userId },
    });
  }
}

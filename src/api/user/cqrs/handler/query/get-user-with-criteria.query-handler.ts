import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserWithCriteriaQuery } from '../../query/get-user-with-criteria.query';
import { UserEntity } from '../../../domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(GetUserWithCriteriaQuery)
export class GetUserWithCriteriaQueryHandler implements IQueryHandler<GetUserWithCriteriaQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserWithCriteriaQuery): Promise<UserEntity[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (query.getUserWithCriteriaDto.isDeleted) {
      queryBuilder.where('user.isDeleted != null');
    }

    if (query.getUserWithCriteriaDto.createdFrom) {
      queryBuilder.where('user.createdAt >= :from', { from: query.getUserWithCriteriaDto.createdFrom });
    }

    if (query.getUserWithCriteriaDto.createdTo) {
      queryBuilder.where('user.createdAt <= :to', { to: query.getUserWithCriteriaDto.createdTo });
    }

    if (query.getUserWithCriteriaDto.updatedFrom) {
      queryBuilder.where('user.updatedAt >= :from', { from: query.getUserWithCriteriaDto.updatedFrom });
    }

    if (query.getUserWithCriteriaDto.updatedTo) {
      queryBuilder.where('user.updatedAt <= :to', { to: query.getUserWithCriteriaDto.updatedTo });
    }

    if (query.getUserWithCriteriaDto.deletedFrom) {
      queryBuilder.where('user.deletedAt >= :from', { from: query.getUserWithCriteriaDto.deletedFrom });
    }

    if (query.getUserWithCriteriaDto.deletedTo) {
      queryBuilder.where('user.deletedAt <= :to', { to: query.getUserWithCriteriaDto.deletedTo });
    }

    if (query.getUserWithCriteriaDto.role) {
      queryBuilder.where('user.roles LIKE :roles', { role: query.getUserWithCriteriaDto.role });
    }

    if (query.getUserWithCriteriaDto.username) {
      queryBuilder.where('user.username LIKE :username', { username: query.getUserWithCriteriaDto.username });
    }

    if (query.getUserWithCriteriaDto.mail) {
      queryBuilder.where('user.mail LIKE :mail', { mail: query.getUserWithCriteriaDto.mail });
    }

    return await queryBuilder.getMany();
  }
}

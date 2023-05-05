import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserLoginQuery } from '../../query/get-user-login.query';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { config } from 'dotenv';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginOfUserEvent } from '../../event/login-of-user.event';

config();

@QueryHandler(GetUserLoginQuery)
export class GetUserLoginQueryHandler implements IQueryHandler<GetUserLoginQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private eventBus: EventBus,
  ) {}

  async execute(query: GetUserLoginQuery): Promise<UserEntity> {
    try {
      const userUsername = await this.userRepository.findOne({
        where: [{ username: query.username }],
        select: ['id', 'username', 'password', 'mail', 'roles', 'createdAt', 'updatedAt', 'deletedAt'],
      });

      if (userUsername) {
        if (!(await this.verifyPassword(query.plainTextPassword, userUsername.password))) {
          throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
        await this.eventBus.publish(new LoginOfUserEvent(userUsername.id));

        return userUsername;
      } else {
        const userUsername = await this.userRepository.findOne({
          where: [{ mail: query.username }],
          select: ['id', 'username', 'password', 'mail', 'roles', 'createdAt', 'updatedAt', 'deletedAt'],
        });
        if (userUsername) {
          if (!(await this.verifyPassword(query.plainTextPassword, userUsername.password))) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
          }
          this.eventBus.publish(new LoginOfUserEvent(userUsername.id));
          return userUsername;
        } else {
          throw new Error('no match found');
        }
      }
    } catch (error) {
      throw new Error('no match found');
    }
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}

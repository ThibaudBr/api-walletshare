import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './cqrs/command/create-user.command';
import { CreateUserDto } from './domain/dto/create-user.dto';
import { CreateUserResponse } from './domain/response/create-user.response';
import { GetUserByEmailQuery } from './cqrs/query/get-user-by-email.query';
import { UserEntity } from './domain/entities/user.entity';
import { GetUserByUsernameQuery } from './cqrs/query/get-user-by-username.query';
import * as process from 'process';
import { UserLoginResponse } from './domain/response/user-login.response';
import { RemoveRefreshTokenCommand } from './cqrs/command/remove-refresh-token.command';
import { SetCurrentRefreshTokenCommand } from './cqrs/command/set-current-refresh-token.command';
import { GetUserIfRefreshTokenMatchesQuery } from './cqrs/query/get-user-if-refresh-token-matches.query';
import { UpdateUserDto } from './domain/dto/update-user.dto';
import { DeleteUserCommand } from './cqrs/command/delete-user.command';
import { GetUserQuery } from './cqrs/query/get-user.query';
import { UpdateUserCommand } from './cqrs/command/update-user.command';

@Injectable()
export class UserService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  async getUserLogin(login?: string): Promise<UserLoginResponse> {
    try {
      let user: UserEntity;
      const regex = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');

      if (!login) {
        throw new Error('Error: no login provided');
      }

      if (login.match(regex)) {
        // Login is an email
        user = await this.queryBus.execute(new GetUserByEmailQuery(login));
      } else {
        // Login is a username
        user = await this.queryBus.execute(new GetUserByUsernameQuery(login));
      }

      if (!user) {
        throw new Error('Error: no match found');
      }
      return new UserLoginResponse({
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        userRoles: user.userRoles,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  //TODO: Implement this
  async getUserByReferralCode(referralCode: string): Promise<UserEntity> {
    // return this.queryBus.execute(new GetUserByReferralCodeQuery(referralCode));
    throw new Error('Not implemented');
  }

  // Generate a random alphanumeric code of a given length
  private generateCode(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return code;
  }

  // Generate a unique referral code that does not already exist in the database
  async generateUniqueReferralCode(): Promise<string> {
    let code = this.generateCode(Number(process.env.LENGTH_REFERRAL_CODE) || 6);
    while (await this.getUserByReferralCode(code)) {
      code = this.generateCode(Number(process.env.LENGTH_REFERRAL_CODE) || 6);
    }
    return code;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    return this.queryBus.execute(new GetUserIfRefreshTokenMatchesQuery(refreshToken, userId));
  }

  async removeRefreshToken(userId: string) {
    return this.commandBus.execute(new RemoveRefreshTokenCommand(userId));
  }

  async setCurrentRefreshToken(token: string, userId: string) {
    return this.commandBus.execute(new SetCurrentRefreshTokenCommand(token, userId));
  }

  async findAll() {
    return this.queryBus.execute(new GetUserQuery());
  }

  async findOne(id: string) {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.commandBus.execute(new UpdateUserCommand(id, updateUserDto));
  }

  async remove(id: string) {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}

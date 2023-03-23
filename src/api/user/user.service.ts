import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './cqrs/command/create-user.command';
import { CreateUserDto } from './domain/dto/create-user.dto';
import { CreateUserResponse } from './domain/response/create-user.response';
import { UserEntity } from './domain/entities/user.entity';
import * as process from 'process';
import { RemoveRefreshTokenCommand } from './cqrs/command/remove-refresh-token.command';
import { SetCurrentRefreshTokenCommand } from './cqrs/command/set-current-refresh-token.command';
import { GetUserIfRefreshTokenMatchesQuery } from './cqrs/query/get-user-if-refresh-token-matches.query';
import { UpdateUserDto } from './domain/dto/update-user.dto';
import { GetUserQuery } from './cqrs/query/get-user.query';
import { UpdateUserCommand } from './cqrs/command/update-user.command';
import { UserResponse } from './domain/response/user.response';
import { SoftDeleteUserCommand } from './cqrs/command/soft-delete-user.command';
import { GetUserWithCriteriaQuery } from './cqrs/query/get-user-with-criteria.query';
import { GetUserWithCriteriaDto } from './domain/dto/get-user-with-criteria.dto';
import { RestoreUserCommand } from './cqrs/command/restore-user.command';
import { UserRoleEnum } from './domain/enum/user-role.enum';
import { UpdateUserRoleCommand } from './cqrs/command/update-user-role.command';
import { UpdateUserCredentialCommand } from './cqrs/command/update-user-credential.command';
import { UpdateUserCredentialDto } from './domain/dto/update-user-credential.dto';
import { GenerateUserDto } from './domain/dto/generate-user.dto';
import { DeleteMailCommand } from '../api-landing-page/cqrs/command/delete-mail.command';

@Injectable()
export class UserService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    return this.queryBus.execute(new GetUserIfRefreshTokenMatchesQuery(refreshToken, userId));
  }

  async removeRefreshToken(userId: string): Promise<void> {
    return await this.commandBus.execute(new RemoveRefreshTokenCommand(userId));
  }

  async setCurrentRefreshToken(token: string, userId: string): Promise<void> {
    return this.commandBus.execute(new SetCurrentRefreshTokenCommand(token, userId));
  }

  async findAll(): Promise<UserResponse[]> {
    return this.queryBus.execute(new GetUserQuery());
  }

  async findOne(id: string): Promise<UserResponse> {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    return this.commandBus.execute(new UpdateUserCommand(userId, updateUserDto));
  }

  async remove(id: string): Promise<void> {
    return this.commandBus.execute(new SoftDeleteUserCommand(id));
  }

  async generateUserFromMail(generateUserDto: GenerateUserDto): Promise<CreateUserResponse> {
    try {
      if (!generateUserDto) throw new Error('Mail is required');
      if ((await this.queryBus.execute(new GetUserWithCriteriaQuery({ mail: generateUserDto.mail }))).length > 0)
        throw new Error('User already exists');
      const user = await this.commandBus.execute(
        new CreateUserCommand(
          new CreateUserDto({
            mail: generateUserDto.mail,
            password: this.generatePassword(),
            roles: generateUserDto.userRoles ? generateUserDto.userRoles : [UserRoleEnum.PUBLIC],
          }),
        ),
      );
      await this.commandBus.execute(new DeleteMailCommand({ mail: generateUserDto.mail }));
      return user;
    } catch (error) {
      throw error;
    }
  }

  async restoreUser(userId: string): Promise<void> {
    return await this.commandBus.execute(new RestoreUserCommand({ userId: userId }));
  }

  async findWithCriteria(getUserWithCriteriaDto: GetUserWithCriteriaDto): Promise<UserResponse[]> {
    return this.queryBus.execute(new GetUserWithCriteriaQuery(getUserWithCriteriaDto));
  }

  async getMe(userId: string): Promise<UserResponse> {
    return await this.queryBus.execute(new GetUserQuery(userId));
  }

  async updateRoles(userId: string, roles: UserRoleEnum[]): Promise<UserResponse> {
    return await this.commandBus.execute(new UpdateUserRoleCommand({ userId: userId, roles: roles }));
  }

  async updateMe(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    if (!!(await this.queryBus.execute(new GetUserQuery(userId)))) throw new Error('User not found');
    return await this.commandBus.execute(new UpdateUserCommand(userId, updateUserDto));
  }

  async updatePassword(userId: string, updateUserCredentialDto: UpdateUserCredentialDto): Promise<UserResponse> {
    if (!!(await this.queryBus.execute(new GetUserQuery(userId)))) throw new Error('User not found');
    return await this.commandBus.execute(
      new UpdateUserCredentialCommand({ userId: userId, updateUserCredentialDto: updateUserCredentialDto }),
    );
  }

  async deleteMe(userId: string): Promise<void> {
    if (!!(await this.queryBus.execute(new GetUserQuery(userId)))) throw new Error('User not found');
    return await this.commandBus.execute(new SoftDeleteUserCommand(userId));
  }

  async findMe(userId: string): Promise<UserResponse> {
    if (!!(await this.queryBus.execute(new GetUserQuery(userId)))) throw new Error('User not found');
    return await this.queryBus.execute(new GetUserQuery(userId));
  }

  private generatePassword(): string {
    return Math.random().toString(36).slice(-8);
  }
}

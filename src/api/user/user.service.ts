import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './cqrs/command/create-user.command';
import { CreateUserDto } from './domain/dto/create-user.dto';
import { CreateUserResponse } from './domain/response/create-user.response';
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
import { DuplicateMailException } from '../../util/exception/custom-http-exception/duplicate-mail.exception';
import { MailRequiredException } from '../../util/exception/custom-http-exception/mail-required.exception';
import { UserNotFoundException } from '../../util/exception/custom-http-exception/user-not-found.exception';
import { DuplicateUsernameException } from '../../util/exception/custom-http-exception/duplicate-username.exception';
import { SamePasswordException } from '../../util/exception/custom-http-exception/same-password.exception';
import { InvalidPasswordException } from '../../util/exception/custom-http-exception/invalid-password.exception';
import { RequestUser } from '../auth/interface/request-user.interface';
import { DeleteUserCommand } from './cqrs/command/delete-user.command';

@Injectable()
export class UserService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    return await this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string): Promise<RequestUser> {
    return await this.queryBus.execute(new GetUserIfRefreshTokenMatchesQuery(refreshToken, userId));
  }

  async removeRefreshToken(userId: string): Promise<void> {
    return await this.commandBus.execute(new RemoveRefreshTokenCommand(userId));
  }

  async setCurrentRefreshToken(token: string, userId: string): Promise<void> {
    return await this.commandBus.execute(new SetCurrentRefreshTokenCommand(token, userId));
  }

  async findAll(): Promise<UserResponse[]> {
    return await this.queryBus.execute(new GetUserQuery());
  }

  async findOne(id: string): Promise<UserResponse> {
    try {
      return await this.queryBus.execute(new GetUserQuery(id));
    } catch (error) {
      throw new UserNotFoundException();
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    try {
      return await this.commandBus.execute(new UpdateUserCommand(userId, updateUserDto));
    } catch (error) {
      if (error.message === 'User not found') throw new UserNotFoundException();
      else if (error.message === 'Mail already exists' || error instanceof DuplicateMailException)
        throw new DuplicateMailException();
      else if (error instanceof DuplicateUsernameException || error.message === 'Username already exists') {
        throw new DuplicateUsernameException();
      } else throw Error('not handled error');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      return await this.commandBus.execute(new SoftDeleteUserCommand(id));
    } catch (error) {
      if (error.message === 'User not found') throw new UserNotFoundException();
      else throw error;
    }
  }

  async generateUserFromMail(generateUserDto: GenerateUserDto): Promise<CreateUserResponse> {
    try {
      if (!generateUserDto) throw new Error('Mail is required');
      if ((await this.queryBus.execute(new GetUserWithCriteriaQuery({ mail: generateUserDto.mail }))).length > 0)
        throw new Error('Mail already exists');
      const user = await this.commandBus.execute(
        new CreateUserCommand(
          new CreateUserDto({
            mail: generateUserDto.mail,
            password: this.generatePassword(),
            roles: generateUserDto.roles ? generateUserDto.roles : [UserRoleEnum.PUBLIC],
          }),
        ),
      );
      try {
        await this.commandBus.execute(new DeleteMailCommand({ mail: generateUserDto.mail }));
      } catch (error) {}
      return user;
    } catch (error) {
      if (error.message === 'Mail is required') throw new MailRequiredException();
      else if (error.message === 'Mail already exists') throw new DuplicateMailException();
      else throw error;
    }
  }

  async restoreUser(userId: string): Promise<void> {
    try {
      return await this.commandBus.execute(new RestoreUserCommand({ id: userId }));
    } catch (error) {
      if (error.message === 'User not found') throw new UserNotFoundException();
      else throw error;
    }
  }

  async findWithCriteria(getUserWithCriteriaDto: GetUserWithCriteriaDto): Promise<UserResponse[]> {
    return await this.queryBus.execute(new GetUserWithCriteriaQuery(getUserWithCriteriaDto));
  }

  async getMe(userId: string): Promise<UserResponse> {
    return await this.queryBus.execute(new GetUserQuery(userId));
  }

  async updateRoles(userId: string, roles: UserRoleEnum[]): Promise<UserResponse> {
    try {
      return await this.commandBus.execute(new UpdateUserRoleCommand({ userId: userId, roles: roles }));
    } catch (error) {
      throw new UserNotFoundException();
    }
  }

  async updatePassword(userId: string, updateUserCredentialDto: UpdateUserCredentialDto): Promise<UserResponse> {
    try {
      return await this.commandBus.execute(
        new UpdateUserCredentialCommand({ userId: userId, updateUserCredentialDto: updateUserCredentialDto }),
      );
    } catch (error) {
      if (error.message === 'New password is the same as old password') throw new SamePasswordException();
      else if (error.message === 'User not found') throw new UserNotFoundException();
      else if (error.message === 'Invalid password') throw new InvalidPasswordException();
      else if (error.message === 'Invalid old password') throw new InvalidPasswordException();
      else throw error;
    }
  }

  async deleteMe(userId: string): Promise<void> {
    if (!!(await this.queryBus.execute(new GetUserQuery(userId)))) throw new Error('User not found');
    return await this.commandBus.execute(new SoftDeleteUserCommand(userId));
  }

  async findMe(userId: string): Promise<UserResponse> {
    if (!(await this.queryBus.execute(new GetUserQuery(userId)))) throw new Error('User not found');
    return await this.queryBus.execute(new GetUserQuery(userId));
  }

  private generatePassword(): string {
    return 'Pt' + Math.random().toString(10).split('.')[1] + '!';
  }

  async fullDelete(id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteUserCommand({ userId: id }));
  }
}

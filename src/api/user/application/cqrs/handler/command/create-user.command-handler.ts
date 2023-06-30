import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../command/create-user.command';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { DuplicateUsernameHttpException } from '../../../../../../util/exception/custom-http-exception/duplicate-username.http-exception';
import { DuplicateMailHttpException } from '../../../../../../util/exception/custom-http-exception/duplicate-mail.http-exception';
import { InvalidParameterEntityHttpException } from '../../../../../../util/exception/custom-http-exception/invalid-parameter-entity.http-exception';
import { CreateUserResponse } from '../../../../web/response/create-user.response';
import { UserRoleEnum } from '../../../../domain/enum/user-role.enum';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { InvalidPasswordHttpException } from '../../../../../../util/exception/custom-http-exception/invalid-password.http-exception';
import { InvalidMailHttpException } from '../../../../../../util/exception/custom-http-exception/invalid-mail.http-exception';
import { InvalidUsernameHttpException } from '../../../../../../util/exception/custom-http-exception/invalid-username.http-exception';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CreateUserEvent } from '../../event/create-user.event';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  private regexValidatePassword;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
    public readonly eventBus: EventBus,
  ) {
    this.regexValidatePassword = new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{6,}$');
  }

  async execute(command: CreateUserCommand): Promise<CreateUserResponse> {
    try {
      if (command.createUserDto.username) {
        if (await this.isDuplicatedUsername(command.createUserDto.username)) {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              localisation: 'isDuplicatedUsername',
              handler: 'Register',
              error: 'Username already exists',
            }),
          );
          throw new DuplicateUsernameHttpException();
        }
      }

      if (command.createUserDto.mail) {
        if (await this.isDuplicatedEmail(command.createUserDto.mail)) {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              localisation: 'isDuplicatedEmail',
              handler: 'Register',
              error: 'Email already exists',
            }),
          );
          throw new DuplicateMailHttpException();
        }
      }

      if (!this.isValidPassword(command.createUserDto.password)) {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'isValidPassword',
            handler: 'CreateUserCommandHandler',
            error: 'Invalid password : ' + command.createUserDto.password,
          }),
        );
        throw new InvalidPasswordHttpException();
      }

      if (command.createUserDto.mail) {
        if (!this.isValidEmail(command.createUserDto.mail)) {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              localisation: 'isValidEmail',
              handler: 'CreateUserCommandHandler',
              error: 'Invalid mail: ' + command.createUserDto.mail,
            }),
          );
          throw new InvalidMailHttpException();
        }
      }

      if (command.createUserDto.username) {
        if (!this.isValidUsername(command.createUserDto.username)) {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              localisation: 'isValidUsername',
              handler: 'CreateUserCommandHandler',
              error: 'Invalid username: ' + command.createUserDto.username,
            }),
          );
          throw new InvalidUsernameHttpException(command.createUserDto.username);
        }
      }

      const newUser: UserEntity = new UserEntity({
        ...command.createUserDto,
        password: bcrypt.hashSync(command.createUserDto.password, 10),
      });

      const err = await validate(newUser);
      if (err.length > 0) {
        throw new InvalidParameterEntityHttpException(err);
      }

      const savedUser: UserEntity = await this.userRepository.save(newUser);

      await this.eventBus.publish(new CreateUserEvent(savedUser.id, command.createUserDto));
      return new CreateUserResponse({
        id: savedUser.id,
        username: savedUser.username,
        mail: savedUser.mail,
        roles: savedUser.roles || [UserRoleEnum.PUBLIC],
      });
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'user', handler: 'CreateUserCommandHandler', error: error }),
      );
      throw error;
    }
  }

  private async isDuplicatedUsername(username: string): Promise<boolean> {
    return await this.userRepository.find().then(users => {
      return users.some(user => user.username === username);
    });
  }

  private async isDuplicatedEmail(email: string): Promise<boolean> {
    return await this.userRepository.find().then(users => {
      return users.some(user => user.mail === email);
    });
  }

  private isValidPassword(password: string): boolean {
    return this.regexValidatePassword.test(password);
  }

  private isValidUsername(username: string): boolean {
    return username.length >= 3 && username.length < 20;
  }

  private isValidEmail(email: string): boolean {
    const regex = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$');
    return regex.test(email);
  }
}

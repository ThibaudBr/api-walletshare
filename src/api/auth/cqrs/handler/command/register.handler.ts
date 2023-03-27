import { RegisterCommand } from '../../command/register.command';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { RegisterEvent } from '../../event/register.event';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { InvalidParameterEntityException } from '../../../../../util/exception/custom-http-exception/invalid-parameter-entity.exception';
import { InvalidPasswordException } from '../../../../../util/exception/custom-http-exception/invalid-password.exception';
import { DuplicateEmailException } from '../../../../../util/exception/custom-http-exception/duplicate-email.exception';
import { DuplicateUsernameException } from '../../../../../util/exception/custom-http-exception/duplicate-username.exception';
import * as bcrypt from 'bcrypt';
import { InvalidMailException } from '../../../../../util/exception/custom-http-exception/invalid-mail.exception';
import { InvalidUsernameException } from '../../../../../util/exception/custom-http-exception/invalid-username.exception';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  private regexValidatePassword;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private eventBus: EventBus,
  ) {
    this.regexValidatePassword = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,}$');
  }

  async execute(command: RegisterCommand): Promise<UserEntity> {
    if (await this.isDuplicatedUsername(command.username)) {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Username already exists' }),
      );
      throw new DuplicateUsernameException();
    }
    if (await this.isDuplicatedEmail(command.mail)) {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Email already exists' }),
      );
      throw new DuplicateEmailException();
    }

    if (this.isValidPassword(command.password)) {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Invalid password' }),
      );
      throw new InvalidPasswordException();
    }

    if (command.mail) {
      if (!this.isValidEmail(command.mail)) {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Invalid mail' }),
        );
        throw new InvalidMailException();
      }
    }

    if (command.username) {
      if (!this.isValidUsername(command.username)) {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Invalid username' }),
        );
        throw new InvalidUsernameException();
      }
    }

    const newUser = new UserEntity({
      mail: command.mail,
      password: bcrypt.hashSync(command.password, 10),
      username: command.username,
    });
    const err = await validate(newUser);
    if (err.length > 0) {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Invalid parameters :' + err }),
      );
      throw new InvalidParameterEntityException(err);
    }

    const insertedUser = await this.userRepository.save(newUser);
    this.eventBus.publish(new RegisterEvent(insertedUser.id));
    return insertedUser;
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
    return !this.regexValidatePassword.test(password);
  }

  private isValidUsername(username: string): boolean {
    return username.length > 4 && username.length < 20;
  }

  private isValidEmail(email: string): boolean {
    const regex = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$');
    return regex.test(email);
  }
}

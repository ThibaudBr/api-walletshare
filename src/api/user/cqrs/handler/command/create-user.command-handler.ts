import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../command/create-user.command';
import { UserEntity } from '../../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { DuplicateUsernameHttpException } from '../../../../../util/exception/custom-http-exception/duplicate-username.http-exception';
import { DuplicateMailHttpException } from '../../../../../util/exception/custom-http-exception/duplicate-mail.http-exception';
import { InvalidParameterEntityHttpException } from '../../../../../util/exception/custom-http-exception/invalid-parameter-entity.http-exception';
import { CreateUserResponse } from '../../../domain/response/create-user.response';
import { UserRoleEnum } from '../../../domain/enum/user-role.enum';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { InvalidPasswordHttpException } from '../../../../../util/exception/custom-http-exception/invalid-password.http-exception';
import { InvalidMailHttpException } from '../../../../../util/exception/custom-http-exception/invalid-mail.http-exception';
import { InvalidUsernameHttpException } from '../../../../../util/exception/custom-http-exception/invalid-username.http-exception';
import * as bcrypt from 'bcrypt';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  private regexValidatePassword;

  constructor(
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
          this.eventBus.publish(
            new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Username already exists' }),
          );
          throw new DuplicateUsernameHttpException();
        }
      }

      if (command.createUserDto.mail) {
        if (await this.isDuplicatedEmail(command.createUserDto.mail)) {
          this.eventBus.publish(
            new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Email already exists' }),
          );
          throw new DuplicateMailHttpException();
        }
      }

      if (!this.isValidPassword(command.createUserDto.password)) {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Invalid password' }),
        );
        throw new InvalidPasswordHttpException();
      }

      if (command.createUserDto.mail) {
        if (!this.isValidEmail(command.createUserDto.mail)) {
          this.eventBus.publish(
            new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Invalid mail' }),
          );
          throw new InvalidMailHttpException();
        }
      }

      if (command.createUserDto.username) {
        if (!this.isValidUsername(command.createUserDto.username)) {
          this.eventBus.publish(
            new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Invalid username' }),
          );
          throw new InvalidUsernameHttpException();
        }
      }

      const newUser: UserEntity = new UserEntity({
        ...command.createUserDto,
        password: bcrypt.hashSync(command.createUserDto.password, 10),
        referralCode: await this.generateUniqueReferralCode(),
      });

      const err = await validate(newUser);
      if (err.length > 0) {
        throw new InvalidParameterEntityHttpException(err);
      }

      const savedUser: UserEntity = await this.userRepository.save(newUser);

      return new CreateUserResponse({
        id: savedUser.id,
        username: savedUser.username,
        mail: savedUser.mail,
        roles: savedUser.roles || [UserRoleEnum.PUBLIC],
        referralCode: savedUser.referralCode,
      });
    } catch (error) {
      this.eventBus.publish(new ErrorCustomEvent({ localisation: 'user', handler: 'CreateUser', error: error }));
      throw error;
    }
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

  async getUserByReferralCode(referralCode: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { referralCode: referralCode } });
    return !!user;
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
    return username.length > 4 && username.length < 20;
  }

  private isValidEmail(email: string): boolean {
    const regex = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$');
    return regex.test(email);
  }
}

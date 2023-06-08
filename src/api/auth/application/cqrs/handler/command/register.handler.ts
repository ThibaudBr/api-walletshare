import { RegisterCommand } from '../../command/register.command';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { RegisterEvent } from '../../event/register.event';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { InvalidParameterEntityHttpException } from '../../../../../../util/exception/custom-http-exception/invalid-parameter-entity.http-exception';
import { InvalidPasswordHttpException } from '../../../../../../util/exception/custom-http-exception/invalid-password.http-exception';
import { DuplicateMailHttpException } from '../../../../../../util/exception/custom-http-exception/duplicate-mail.http-exception';
import { DuplicateUsernameHttpException } from '../../../../../../util/exception/custom-http-exception/duplicate-username.http-exception';
import * as bcrypt from 'bcrypt';
import { InvalidMailHttpException } from '../../../../../../util/exception/custom-http-exception/invalid-mail.http-exception';
import { InvalidUsernameHttpException } from '../../../../../../util/exception/custom-http-exception/invalid-username.http-exception';
import { ConfigService } from '@nestjs/config';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  private regexValidatePassword;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private eventBus: EventBus,
    private readonly configService: ConfigService,
  ) {
    this.regexValidatePassword = new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{6,}$');
  }

  async execute(command: RegisterCommand): Promise<UserEntity> {
    if (await this.isDuplicatedUsername(command.username)) {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Username already exists' }),
      );
      throw new DuplicateUsernameHttpException();
    }
    if (await this.isDuplicatedEmail(command.mail)) {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Email already exists' }),
      );
      throw new DuplicateMailHttpException();
    }

    if (this.isValidPassword(command.password)) {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Invalid password' }),
      );
      throw new InvalidPasswordHttpException();
    }

    if (command.mail) {
      if (!this.isValidEmail(command.mail)) {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Invalid mail' }),
        );
        throw new InvalidMailHttpException();
      }
    }

    if (command.username) {
      if (!this.isValidUsername(command.username)) {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Invalid username' }),
        );
        throw new InvalidUsernameHttpException();
      }
    }

    const newUser = new UserEntity({
      mail: command.mail,
      password: bcrypt.hashSync(command.password, 10),
      username: command.username,
      referralCode: await this.generateUniqueReferralCode(),
    });
    const err = await validate(newUser);
    if (err.length > 0) {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'auth', handler: 'Register', error: 'Invalid parameters :' + err }),
      );
      throw new InvalidParameterEntityHttpException(err);
    }

    const insertedUser = await this.userRepository.save(newUser);
    this.eventBus.publish(new RegisterEvent(insertedUser.id));
    return insertedUser;
  }

  // Generate a unique referral code that does not already exist in the database
  async generateUniqueReferralCode(): Promise<string> {
    let code = this.generateCode(this.configService.get('LENGTH_REFERRAL_CODE') ?? 6);
    while (await this.getUserByReferralCode(code)) {
      code = this.generateCode(this.configService.get('LENGTH_REFERRAL_CODE') ?? 6);
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
    return !this.regexValidatePassword.test(password);
  }

  private isValidUsername(username: string): boolean {
    return username.length > 4 && username.length < 20;
  }

  private isValidEmail(email: string): boolean {
    const regex = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$');
    return regex.test(email);
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
}

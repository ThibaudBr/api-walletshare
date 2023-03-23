import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../command/create-user.command';
import { UserEntity } from '../../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { DuplicateUsernameException } from '../../../../../util/exception/custom-http-exception/duplicate-username.exception';
import { DuplicateEmailException } from '../../../../../util/exception/custom-http-exception/duplicate-email.exception';
import { InvalidParameterEntityException } from '../../../../../util/exception/custom-http-exception/invalid-parameter-entity.exception';
import { CreateUserResponse } from '../../../domain/response/create-user.response';
import { UserRoleEnum } from '../../../domain/enum/user-role.enum';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
    public readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResponse> {
    try {
      const newUser: UserEntity = new UserEntity({ ...command.createUserDto });

      const err = await validate(newUser);
      if (err.length > 0) {
        throw new InvalidParameterEntityException(err);
      }

      // verify that email is unique
      const userUniqueEmail = await this.userRepository.findBy({ mail: command.createUserDto.mail });
      if (userUniqueEmail.length > 0) {
        throw new DuplicateEmailException();
      }

      // verify that username is unique
      const userUniqueUsername = await this.userRepository.findBy({ username: command.createUserDto.username });
      if (userUniqueUsername.length > 0) {
        throw new DuplicateUsernameException();
      }

      const savedUser: UserEntity = await this.userRepository.save(newUser);

      return new CreateUserResponse({
        id: savedUser.id,
        username: savedUser.username,
        mail: savedUser.mail,
        roles: savedUser.roles || [UserRoleEnum.PUBLIC],
      });
    } catch (error) {
      if (
        error instanceof InvalidParameterEntityException ||
        error instanceof DuplicateEmailException ||
        error instanceof DuplicateUsernameException
      ) {
        throw error;
      }
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
    const user = await this.userRepository.findOne({ where: { referralCodeString: referralCode } });
    return !!user;
  }
}

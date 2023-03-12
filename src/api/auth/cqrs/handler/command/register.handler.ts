import { RegisterCommand } from '../../command/register.command';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { validate } from 'class-validator';
import { InvalidClassException } from '@nestjs/core/errors/exceptions/invalid-class.exception';
import { RegisterEvent } from '../../event/register.event';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private eventBus: EventBus,
  ) {}

  async execute(command: RegisterCommand): Promise<UserEntity> {
    try {
      const newUser = new UserEntity();
      newUser.email = command.email;
      newUser.password = command.password;
      newUser.username = command.username;
      const err = await validate(newUser);
      if (err.length > 0) {
        this.eventBus.publish(new ErrorCustomEvent('auth', 'Register', 'Invalid parameters'));
        throw new InvalidClassException('Parameter not validate');
      }
      await this.userRepository.save(newUser);
      this.eventBus.publish(new RegisterEvent(newUser.username));
      newUser.password = '';
      return newUser;
    } catch (error) {
      this.eventBus.publish(new ErrorCustomEvent('auth', 'RegisterHandler', 'Failed to register account'));
      throw new InternalServerErrorException('Internal Server Error!');
    }
  }
}

import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../../command/update-user.command';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../domain/entities/user.entity';
import { validate } from 'class-validator';
import { InvalidClassException } from '@nestjs/core/errors/exceptions/invalid-class.exception';
import { UpdateUserEvent } from '../../event/update-user.event';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { UserResponse } from '../../../domain/response/user.response';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  logger = new Logger('UpdateUser');

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    public eventBus: EventBus,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserResponse> {
    try {
      const err = await validate(UpdateUserCommand);
      if (err.length > 0) {
        this.logger.error('Invalid parameters');
        throw new InvalidClassException('Parameter not validate');
      }
      await this.userRepository.update(command.userId, command.user);
      const user: UserEntity = await this.userRepository.findOneOrFail({
        where: [{ id: command.userId }],
      });
      this.eventBus.publish(new UpdateUserEvent(command.userId));
      return new UserResponse(user.id, user.username, user.email);
    } catch (error) {
      this.eventBus.publish(new ErrorCustomEvent('user', 'UpdateUserHandler', error));
      throw error;
    }
  }
}

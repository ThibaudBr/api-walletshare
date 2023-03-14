import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../../command/delete-user.command';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../domain/entities/user.entity';
import { DeleteUserEvent } from '../../event/delete-user.event';
import { ErrorCustomEvent } from "../../../../../util/exception/error-handler/error-custom.event";

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {
  logger = new Logger('DeleteUserCommandHandler');

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    public eventBus: EventBus,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    try {
      await this.userRepository.delete(command.userId);
      this.eventBus.publish(new DeleteUserEvent(command.userId));
    } catch (error) {
      this.eventBus.publish(new ErrorCustomEvent('user', 'DeleteUserCommandHandler', error));
    }
  }
}

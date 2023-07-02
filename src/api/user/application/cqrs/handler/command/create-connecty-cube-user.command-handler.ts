import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateConnectyCubeUserCommand } from '../../command/create-connecty-cube-user.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { CreateConnectyCubeUserEvent } from '../../event/create-connecty-cube-user.event';

@CommandHandler(CreateConnectyCubeUserCommand)
export class CreateConnectyCubeUserCommandHandler implements ICommandHandler<CreateConnectyCubeUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateConnectyCubeUserCommand): Promise<void> {
    return await this.userRepository
      .findOneOrFail({
        where: { id: command.userId },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateConnectyCubeUserCommandHandler',
            localisation: 'userRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw new Error('User not found');
      })
      .then(async (user: UserEntity): Promise<void> => {
        user.connectyCubeId = command.connectyCubeId;
        user.connectyCubeToken = command.connectyCubeToken;
        await this.userRepository
          .save(user)
          .catch(async (error: Error): Promise<void> => {
            await this.eventBus.publish(
              new ErrorCustomEvent({
                handler: 'CreateConnectyCubeUserCommandHandler',
                localisation: 'userRepository.save',
                error: error.message,
              }),
            );
            throw new Error('Error while saving user');
          })
          .then(async () => {
            await this.eventBus.publish(
              new CreateConnectyCubeUserEvent({
                userId: command.userId,
                connectyCubeId: command.connectyCubeId,
              }),
            );
          });
      });
  }
}

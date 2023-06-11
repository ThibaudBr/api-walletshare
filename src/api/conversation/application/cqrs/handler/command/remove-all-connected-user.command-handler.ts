import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveAllConnectedUserCommand } from '../../command/remove-all-connected-user.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from '../../../../domain/entities/connected-user.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RemoveAllConnectedUserCommand)
export class RemoveAllConnectedUserCommandHandler implements ICommandHandler<RemoveAllConnectedUserCommand> {
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveAllConnectedUserCommand): Promise<void> {
    await this.connectedUserRepository
      .find()
      .then(async (connectedUsers: ConnectedUserEntity[]) => {
        await this.connectedUserRepository.remove(connectedUsers).catch(async (error: Error) => {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              handler: 'RemoveAllConnectedUserCommandHandler',
              localisation: 'connectedUserRepository.remove',
              error: error.message,
            }),
          );
          throw new Error('Failed to remove all connected user');
        });
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'RemoveAllConnectedUserCommandHandler',
            localisation: 'connectedUserRepository.find',
            error: error.message,
          }),
        );
        throw new Error('Failed to remove all connected user');
      });
  }
}

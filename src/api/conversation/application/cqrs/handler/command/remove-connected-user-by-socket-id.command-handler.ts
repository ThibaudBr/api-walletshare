import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveConnectedUserBySocketIdCommand } from '../../command/remove-connected-user-by-socket-id.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from '../../../../domain/entities/connected-user.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RemoveConnectedUserBySocketIdCommand)
export class RemoveConnectedUserBySocketIdCommandHandler
  implements ICommandHandler<RemoveConnectedUserBySocketIdCommand>
{
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveConnectedUserBySocketIdCommand): Promise<void> {
    await this.connectedUserRepository
      .findOne({
        where: {
          socketId: command.socketId,
        },
      })
      .then(async (connectedUser: ConnectedUserEntity) => {
        if (!connectedUser) return;
        await this.connectedUserRepository.remove(connectedUser).catch(async (error: Error) => {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              handler: 'RemoveConnectedUserBySocketIdCommandHandler',
              localisation: 'connectedUserRepository.remove',
              error: error.message,
            }),
          );
          throw new Error('Failed to remove connected user by socket id');
        });
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'RemoveConnectedUserBySocketIdCommandHandler',
            localisation: 'connectedUserRepository.findOne',
            error: error.message,
          }),
        );
        throw new Error('Failed to remove connected user by socket id');
      });
  }
}

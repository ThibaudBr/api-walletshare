import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateConnectedUserCommand } from '../../command/create-connected-user.command';
import { ConnectedUserEntity } from '../../../../domain/entities/connected-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConnectedUserEvent } from '../../event/create-connected-user.event';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(CreateConnectedUserCommand)
export class CreateConnectedUserCommandHandler implements ICommandHandler<CreateConnectedUserCommand> {
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateConnectedUserCommand): Promise<ConnectedUserEntity> {
    await this.connectedUserRepository
      .findOne({
        relations: ['user'],
        where: {
          user: {
            id: command.user.id,
          },
        },
      })
      .then(async (connectedUser: ConnectedUserEntity | null) => {
        if (connectedUser) {
          await this.connectedUserRepository.remove(connectedUser).catch(async (error: Error) => {
            await this.eventBus.publish(
              new ErrorCustomEvent({
                handler: 'CreateConnectedUserCommandHandler',
                localisation: 'connectedUserRepository.remove',
                error: error.message,
              }),
            );
            throw new Error('Error while removing connected user');
          });
        }
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateConnectedUserCommandHandler',
            localisation: 'connectedUserRepository.findOne',
            error: error.message,
          }),
        );
        throw new Error('Connected user not found');
      });
    const newConnectedUser: ConnectedUserEntity = this.connectedUserRepository.create({
      user: command.user,
      socketId: command.socketId,
    });
    await this.connectedUserRepository.save(newConnectedUser).catch(async (error: Error) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'CreateConnectedUserCommandHandler',
          localisation: 'connectedUserRepository.save',
          error: error.message,
        }),
      );
    });
    await this.eventBus.publish(
      new CreateConnectedUserEvent({ userId: newConnectedUser.user.id, socketId: newConnectedUser.socketId }),
    );

    return newConnectedUser;
  }
}

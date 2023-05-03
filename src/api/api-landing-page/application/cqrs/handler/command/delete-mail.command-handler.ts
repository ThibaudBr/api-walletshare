import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMailCommand } from '../../command/delete-mail.command';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DeleteMailEvent } from '../../event/delete-mail.event';
import { catchError, firstValueFrom } from 'rxjs';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(DeleteMailCommand)
export class DeleteMailCommandHandler implements ICommandHandler<DeleteMailCommand> {
  constructor(@Inject('API_WAITING_LIST') private client: ClientProxy, private readonly eventBus: EventBus) {}

  async execute(command: DeleteMailCommand): Promise<void> {
    return await firstValueFrom(
      this.client.send({ cmd: 'delete' }, command.mail).pipe(
        catchError(async err => {
          if (err.status !== undefined) {
            await this.eventBus.publish(
              new ErrorCustomEvent({
                handler: 'DeleteMailCommandHandler',
                localisation: 'api-waiting-list',
                error: err.message,
              }),
            );
            throw new HttpException('Mail does not exist', 404);
          }
          await this.eventBus.publish(
            new ErrorCustomEvent({
              handler: 'DeleteMailCommandHandler',
              localisation: 'api-waiting-list',
              error: 'unreachable',
            }),
          );
          throw new HttpException('unreachable', HttpStatus.SERVICE_UNAVAILABLE);
        }),
      ),
    ).then(async () => {
      await this.eventBus.publish(new DeleteMailEvent(command));
    });
  }
}

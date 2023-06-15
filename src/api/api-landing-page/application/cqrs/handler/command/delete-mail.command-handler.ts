import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMailCommand } from '../../command/delete-mail.command';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DeleteMailEvent } from '../../event/delete-mail.event';
import { firstValueFrom } from 'rxjs';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@CommandHandler(DeleteMailCommand)
export class DeleteMailCommandHandler implements ICommandHandler<DeleteMailCommand> {
  private readonly apiWaitingListUrl: string;
  private readonly apiWaitingListToken: string;

  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly eventBus: EventBus,
  ) {
    this.apiWaitingListUrl = this.configService.get('API_WAITING_LIST_URL') ?? 'NO-URL';
    this.apiWaitingListToken = this.configService.get('API_WAITING_LIST_TOKEN') ?? 'NO-TOKEN';
  }

  async execute(command: DeleteMailCommand): Promise<void> {
    return await firstValueFrom(
      this.httpService.post(this.apiWaitingListUrl + '/delete', command, {
        headers: {
          Authorization: this.apiWaitingListToken,
        },
      }),
    )
      .then(async () => {
        await this.eventBus.publish(new DeleteMailEvent(command));
      })
      .catch(async err => {
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
      });
  }
}

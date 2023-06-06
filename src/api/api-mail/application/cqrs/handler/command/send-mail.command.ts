import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SendMailEvent } from '../../event/send-mail.event';
import { SendMailCommand } from '../../command/send-mail.command';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(SendMailCommand)
export class SendMailCommandHandler implements ICommandHandler<SendMailCommand> {
  private readonly apiWaitingListUrl: string;

  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly eventBus: EventBus,
  ) {
    this.apiWaitingListUrl = this.configService.get('API_WAITING_LIST_URL') || 'NO-URL';
  }

  async execute(command: SendMailCommand): Promise<void> {
    await firstValueFrom(this.httpService.post(this.apiWaitingListUrl + '/send', command)).catch(async err => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'SendMailCommandHandler',
          localisation: 'api-waiting-list',
          error: err.message,
        }),
      );
      throw new Error('Mail does not exist');
    });
    await this.eventBus.publish(
      new SendMailEvent({
        email: command.email,
      }),
    );
  }
}

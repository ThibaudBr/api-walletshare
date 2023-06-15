import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SendMailEvent } from '../../event/send-mail.event';
import { SendMailCommand } from '../../command/send-mail.command';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(SendMailCommand)
export class SendMailCommandHandler implements ICommandHandler<SendMailCommand> {
  private readonly apiMailUrl: string;
  private readonly apiMailToken: string;

  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly eventBus: EventBus,
  ) {
    this.apiMailUrl = this.configService.get('HOST_API_MAIL') ?? 'NO-URL';
    this.apiMailToken = this.configService.get('API_MAIL_TOKEN') ?? 'no_token';
  }

  async execute(command: SendMailCommand): Promise<void> {
    await firstValueFrom(
      this.httpService.post(this.apiMailUrl + '/' + command.path, command, {
        headers: {
          Authorization: this.apiMailToken,
        },
      }),
    ).catch(async err => {
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

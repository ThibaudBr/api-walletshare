import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SendMailCommand } from './cqrs/command/send-mail.command';

@Injectable()
export class ApiMailService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async sendMail(email: string, title?: string, message?: string): Promise<void> {
    await this.commandBus.execute(
      new SendMailCommand({
        email: email,
        title: title,
        message: message,
      }),
    );
  }
}

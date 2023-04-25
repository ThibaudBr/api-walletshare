import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SendMailCommand } from './cqrs/command/send-mail.command';
import { MailDto } from '../domain/dto/mail.dto';

@Injectable()
export class ApiMailService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async sendMail(mailDto: MailDto): Promise<void> {
    await this.commandBus.execute(
      new SendMailCommand({
        ...mailDto,
      }),
    );
  }
}

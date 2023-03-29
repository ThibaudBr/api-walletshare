import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeleteMailCommand } from './cqrs/command/delete-mail.command';
import { MailResponse } from './domain/response/mail.response';
import { GetAllMailQuery } from './cqrs/query/get-all-mail.query';

@Injectable()
export class ApiLandingPageService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async deleteMail(mail: string): Promise<void> {
    await this.commandBus.execute(
      new DeleteMailCommand({
        mail: mail,
      }),
    );
  }

  async getAll(): Promise<MailResponse[]> {
    return await this.queryBus.execute(new GetAllMailQuery());
  }
}

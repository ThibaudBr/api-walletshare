import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeleteMailCommand } from './cqrs/command/delete-mail.command';
import { MailResponse } from "./domain/response/mail.response";
import { GetAllMailQuery } from "./cqrs/query/get-all-mail.query";
import { MailLandingPageDto } from "./domain/dto/mail-landing-page.dto";

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
    const mailResponseList: MailLandingPageDto[] = await this.queryBus.execute(new GetAllMailQuery());
    return mailResponseList.map((mailLandingPageDto: MailLandingPageDto) => {
      return {
        mail: mailLandingPageDto.mail,
      };
    });
  }
}

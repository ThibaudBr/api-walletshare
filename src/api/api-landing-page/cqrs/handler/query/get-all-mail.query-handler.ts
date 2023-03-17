import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllMailQuery } from '../../query/get-all-mail.query';
import { HttpException, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { MailLandingPageDto } from '../../../domain/dto/mail-landing-page.dto';

@QueryHandler(GetAllMailQuery)
export class GetAllMailQueryHandler implements IQueryHandler<GetAllMailQuery> {
  constructor(@Inject('API_LANDING_PAGE') private client: ClientProxy) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(query: GetAllMailQuery): Promise<MailLandingPageDto[]> {
    return firstValueFrom(
      this.client.send({ cmd: 'get-all' }, '').pipe(
        catchError(() => {
          throw new HttpException('unreachable', 401);
        }),
      ),
    ).then((mailsLandingPageList: MailLandingPageDto[]) => mailsLandingPageList);
  }
}

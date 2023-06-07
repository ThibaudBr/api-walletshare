import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllMailQuery } from '../../query/get-all-mail.query';
import { firstValueFrom } from 'rxjs';
import { MailLandingPageDto } from '../../../../domain/dto/mail-landing-page.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';

@QueryHandler(GetAllMailQuery)
export class GetAllMailQueryHandler implements IQueryHandler<GetAllMailQuery> {
  private readonly apiWaitingListUrl: string;

  constructor(private httpService: HttpService, private readonly configService: ConfigService) {
    this.apiWaitingListUrl = this.configService.get('API_WAITING_LIST_URL') || 'NO-URL';
  }

  async execute(): Promise<MailLandingPageDto[]> {
    return await firstValueFrom(this.httpService.get(this.apiWaitingListUrl + '/all')).then(
      async (response: AxiosResponse) => {
        return response.data;
      },
    );
  }
}

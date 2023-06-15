import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLogCommand } from '../../command/create-log.command';
import { VerboseLogEnum } from '../../../../domain/enum/verbose-log.enum';
import * as process from 'process';
import { ApiTypeEnum } from '../../../../domain/enum/api-type.enum';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@CommandHandler(CreateLogCommand)
export class CreateLogCommandHandler implements ICommandHandler<CreateLogCommand> {
  private readonly API_NAME: string;
  private readonly npm_package_version: string;
  private readonly API_TYPE: ApiTypeEnum;
  private readonly verbose: VerboseLogEnum;
  private readonly apiLogUrl: string;
  private readonly API_LOG_TOKEN: string;

  constructor(private httpService: HttpService, private readonly configService: ConfigService) {
    this.verbose = (configService.get('VERBOSE_LOG') as VerboseLogEnum) ?? VerboseLogEnum.NONE;
    this.API_NAME = configService.get('API_NAME') ?? 'NO-NAME';
    this.npm_package_version = process.env.npm_package_version ?? 'NO-VERSION';
    this.apiLogUrl = configService.get('HOST_API_LOG') ?? 'NO-URL';
    this.API_TYPE = ApiTypeEnum.WALLET_SHARE_API;
    this.API_LOG_TOKEN = configService.get('API_LOG_TOKEN') ?? 'NO-TOKEN';
  }

  async execute(command: CreateLogCommand): Promise<void> {
    if (this.verbose === VerboseLogEnum.NONE) return;
    if (this.verbose === VerboseLogEnum.DEBUG && command.error) console.log('CreateLogCommandHandler: ', command);
    command.apiName = this.API_NAME;
    command.apiVersion = this.npm_package_version;
    command.apiType = this.API_TYPE;
    await firstValueFrom(
      this.httpService.post(this.apiLogUrl + '/create-log', command, {
        headers: {
          Authorization: this.API_LOG_TOKEN,
        },
      }),
    ).catch((): void => {
      return;
    });
  }
}

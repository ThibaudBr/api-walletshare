import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLogCommand } from '../../command/create-log.command';
import { VerboseLogEnum } from '../../../../domain/enum/verbose-log.enum';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as process from 'process';
import { ApiTypeEnum } from '../../../../domain/enum/api-type.enum';
import { ConfigService } from '@nestjs/config';

@CommandHandler(CreateLogCommand)
export class CreateLogCommandHandler implements ICommandHandler<CreateLogCommand> {
  private readonly API_NAME: string;
  private readonly npm_package_version: string;
  private readonly API_TYPE: ApiTypeEnum;
  private readonly verbose: VerboseLogEnum;

  constructor(@Inject('API_LOG') private client: ClientProxy, private readonly configService: ConfigService) {
    this.verbose = (configService.get('VERBOSE_LOG') as VerboseLogEnum) || VerboseLogEnum.NONE;
    this.API_NAME = configService.get('API_NAME') || 'NO-NAME';
    this.npm_package_version = process.env.npm_package_version || 'NO-VERSION';
    this.API_TYPE = ApiTypeEnum.WALLET_SHARE_API;
  }

  async execute(command: CreateLogCommand): Promise<void> {
    if (this.verbose === VerboseLogEnum.NONE) return;
    if (this.verbose === VerboseLogEnum.DEBUG) console.log('CreateLogCommandHandler: ', command);
    command.apiName = this.API_NAME;
    command.apiVersion = this.npm_package_version;
    command.apiType = this.API_TYPE;
    console.log(this.client.emit('create-log', command));
    this.client.emit('create-log', command);
  }
}

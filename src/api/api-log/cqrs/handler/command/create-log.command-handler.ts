import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLogCommand } from '../../command/create-log.command';
import { VerboseLogEnum } from '../../../domain/enum/verbose-log.enum';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as process from 'process';
import { ApiTypeEnum } from '../../../domain/enum/api-type.enum';

@CommandHandler(CreateLogCommand)
export class CreateLogCommandHandler implements ICommandHandler<CreateLogCommand> {
  private readonly API_NAME: string;
  private readonly API_VERSION: string;
  private readonly API_TYPE: ApiTypeEnum;
  private readonly verbose: VerboseLogEnum;

  constructor(@Inject('API_LOG') private client: ClientProxy) {
    this.verbose = (process.env.VERBOSE_LOG as VerboseLogEnum) || VerboseLogEnum.NONE;
    this.API_NAME = process.env.API_NAME || 'NO-NAME';
    this.API_VERSION = process.env.API_VERSION || 'NO-VERSION';
    this.API_TYPE = ApiTypeEnum.WALLET_SHARE_API;
  }

  async execute(command: CreateLogCommand): Promise<void> {
    if (this.verbose === VerboseLogEnum.NONE) return;
    if (this.verbose === VerboseLogEnum.DEBUG) console.log('CreateLogCommandHandler: ', command);
    this.client.emit('create-log', command);
  }
}

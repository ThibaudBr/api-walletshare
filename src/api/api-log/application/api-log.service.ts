import { Injectable } from '@nestjs/common';
import { CreateLogDto } from '../domain/dto/create-log.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateLogCommand } from './cqrs/command/create-log.command';
import { CreateMethodLogDto } from '../domain/dto/create-method-log.dto';

@Injectable()
export class ApiLogService {
  constructor(private readonly commandBus: CommandBus) {}

  async createLog(log: CreateLogDto): Promise<void> {
    await this.commandBus.execute(
      new CreateLogCommand({
        ...log,
      }),
    );
  }

  async createLogForMethode(log: CreateMethodLogDto): Promise<void> {
    const createLogDto: CreateLogDto = new CreateLogDto({
      method: log.method,
      module: log.module,
      body: Object(log.body),
    });

    await this.commandBus.execute(
      new CreateLogCommand({
        ...createLogDto,
      }),
    );
  }
}

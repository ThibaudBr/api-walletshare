import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateLogDto } from './domain/dto/create-log.dto';

@Injectable()
export class ApiLogService {
  constructor(@Inject('API_LOG') private client: ClientProxy) {}
  createLog(log: CreateLogDto): void {
    this.client.emit('create-log', log);
  }
}

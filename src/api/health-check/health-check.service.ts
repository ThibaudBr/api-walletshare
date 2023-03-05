import { Injectable } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { QueryBus } from '@nestjs/cqrs';
import { HealthCheckQuery } from './cqrs/query/health-check.query';
import { HealthCheckResponse } from './domain/response/health-check.response';

@Injectable()
export class CustomHealthCheckService {
  constructor(
    private healthCheckService: HealthCheckService,
    private typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private diskHealthIndicator: DiskHealthIndicator,
    private readonly queryBus: QueryBus,
  ) {}

  async checkHealth(): Promise<HealthCheckResponse> {
    return await this.queryBus.execute(new HealthCheckQuery());
  }
}

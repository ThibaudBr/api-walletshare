import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HealthCheckQuery } from '../../query/health-check.query';
import { HealthCheckResponse } from '../../../domain/response/health-check.response';
import {
  DiskHealthIndicator,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@QueryHandler(HealthCheckQuery)
export class HealthCheckQueryHandler implements IQueryHandler<HealthCheckQuery> {
  constructor(
    private healthCheckService: HealthCheckService,
    private typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private diskHealthIndicator: DiskHealthIndicator,
    private eventBus: EventBus,
  ) {}
  async execute(): Promise<HealthCheckResult> {
    return await this.healthCheckService.check([
      (): Promise<HealthIndicatorResult> => this.typeOrmHealthIndicator.pingCheck('database'),
      // the process should not use more than 300MB memory
      (): Promise<HealthIndicatorResult> => this.memoryHealthIndicator.checkHeap('memory heap', 30000 * 1024 * 1024),
      // The process should not have more than 300MB RSS memory allocated
      (): Promise<HealthIndicatorResult> => this.memoryHealthIndicator.checkRSS('memory RSS', 300 * 1024 * 1024),
      // the used disk storage should not exceed the 50% of the available space
      (): Promise<HealthIndicatorResult> =>
        this.diskHealthIndicator.checkStorage('disk health', {
          thresholdPercent: 0.5,
          path: '/',
        }),
    ]);
  }
}

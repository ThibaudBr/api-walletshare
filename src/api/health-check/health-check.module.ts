import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckController } from './health-check.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CustomHealthCheckService } from './custom-health-check.service';
import { HealthCheckQueryHandler } from './cqrs/handler/query/health-check.query-handler';

@Module({
  imports: [TerminusModule, CqrsModule],
  controllers: [HealthCheckController],
  providers: [
    // ________ Service ________
    CustomHealthCheckService,
    // ________ Handler ________
    HealthCheckQueryHandler,
  ],
})
export default class HealthCheckModule {}

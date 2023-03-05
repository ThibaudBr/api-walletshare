import { HealthCheckResult } from '@nestjs/terminus';

export class HealthCheckResponse {
  constructor(public readonly heathCheck: HealthCheckResult) {}
}

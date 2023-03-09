import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { CustomHealthCheckService } from './custom-health-check.service';
import { HealthCheckResponse } from './domain/response/health-check.response';

/**
 * @api {get} /health-check Health Check
 * @apiName HealthCheck
 * @apiGroup HealthCheck
 * @apiVersion 0.0.1
 * @apiDescription Health Check for API WalletShare
 */
@Controller('health-check')
@ApiTags('HealthCheck')
export class HealthCheckController {
  constructor(private customHealthCheckService: CustomHealthCheckService) {}

  @Get('/')
  @HttpCode(200)
  @HealthCheck()
  @ApiResponse({
    status: 200,
    description: 'Health Check for API WalletShare',
    content: { 'text/html': { example: 'Health Check for API WalletShare' } },
  })
  check(): Promise<HealthCheckResponse> {
    return this.customHealthCheckService.checkHealth();
  }
}

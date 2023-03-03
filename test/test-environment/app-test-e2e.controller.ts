import { Controller, Get, UsePipes } from '@nestjs/common';
import { AppTestE2eService } from './app-test-e2e.service';
import { IsTestEnvironmentPipe } from '../../src/util/pipe/is-test-environment.pipe';

@Controller()
export class AppTestE2eController {
  constructor(private readonly appService: AppTestE2eService) {}

  @UsePipes(new IsTestEnvironmentPipe())
  @Get('/api/test/clear-database-test')
  clearDatabaseTest(): Promise<void> {
    return this.appService.clearDatabaseTest();
  }
}

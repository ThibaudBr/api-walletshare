import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('HelloWorld')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(200)
  @ApiParam({ name: 'helloWorld', description: 'Hello World!' })
  @ApiResponse({ status: 200, description: 'Hello World!' })
  getHello(): string {
    return this.appService.getHello();
  }
}

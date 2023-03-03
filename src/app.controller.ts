import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('HelloWorld')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Hello World!',
    content: { 'text/html': { example: 'Hello World!' } },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}

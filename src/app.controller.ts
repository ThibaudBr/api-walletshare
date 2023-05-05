import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('HelloWorld')
export class AppController {
  /**
   * @ignore
   */
  constructor(private readonly appService: AppService) {}

  /**
   * @api {get} / Hello World
   * @apiName GetHello
   * @apiGroup HelloWorld
   * @apiVersion 0.0.1
   * @apiDescription Hello World!
   * @apiSuccess {String} text/html Hello World!
   * @apiSuccessExample {text/html} Success-Response:
   *    HTTP/1.1 200 OK
   *    Hello World!
   */
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

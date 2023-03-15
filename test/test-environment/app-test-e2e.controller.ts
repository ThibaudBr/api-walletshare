import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { AppTestE2eService } from './app-test-e2e.service';
import { IsTestEnvironmentPipe } from '../../src/util/pipe/is-test-environment.pipe';
import { CreateUserDto } from '../../src/api/user/domain/dto/create-user.dto';
import { UserEntity } from '../../src/api/user/domain/entities/user.entity';

@Controller()
export class AppTestE2eController {
  constructor(private readonly appService: AppTestE2eService) {}

  @UsePipes(new IsTestEnvironmentPipe())
  @Get('/api/test/clear-database-test')
  clearDatabaseTest(): Promise<void> {
    return this.appService.clearDatabaseTest();
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Post('/api/test/create-user-test')
  createUserTest(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.appService.createUserTest(createUserDto);
  }
}

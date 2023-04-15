import { Body, Controller, Delete, Get, HttpCode, Param, Post, UsePipes } from "@nestjs/common";
import { UserTestE2eService } from '../service-test/user-test-e2e.service';
import { IsTestEnvironmentPipe } from '../../../src/util/pipe/is-test-environment.pipe';
import { CreateUserDto } from '../../../src/api/user/domain/dto/create-user.dto';
import { UserEntity } from '../../../src/api/user/domain/entities/user.entity';
import { UserIdDto } from '../../../src/api/user/domain/dto/user-id.dto';

@Controller()
export class UserTestE2eController {
  constructor(private readonly userTestE2eService: UserTestE2eService) {}

  @UsePipes(new IsTestEnvironmentPipe())
  @Post('/api/test/create-user-test')
  createUserTest(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userTestE2eService.createUserTest(createUserDto);
  }

  @HttpCode(204)
  @UsePipes(new IsTestEnvironmentPipe())
  @Delete('/api/test/remove-user-test')
  deleteUserTest(@Body() userIdDto: UserIdDto): Promise<void> {
    return this.userTestE2eService.removeUser(userIdDto.userId);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Get('/api/test/get-all-users-test')
  getAllUsersTest(): Promise<UserEntity[]> {
    return this.userTestE2eService.getAllUsers();
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Get('/api/test/get-user-test/:userId')
  getUserTest(@Param('userId') userId: string): Promise<UserEntity | null> {
    return this.userTestE2eService.getUser(userId);
  }
}

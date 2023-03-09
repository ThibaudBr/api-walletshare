import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './domain/dto/create-user.dto';
import { CreateUserResponse } from './domain/response/create-user.response';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponse | HttpException> {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      return new HttpException(
        {
          type: error.message.split(':')[0],
          error: error.message.split(':')[1],
        },
        error.status,
      );
    }
  }
}
